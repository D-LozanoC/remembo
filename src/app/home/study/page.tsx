'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Flashcard, StudySession } from '@prisma/client';
import SessionDetail from '@/shared/sections/study/components/SessionDetail';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader } from '@/components/Loader';
import Dialog from '@/components/resources/common/Dialog';
import EditSessionTimeDialog from '@/shared/sections/study/components/EditSessionTimeDialog';

interface DeckResponse {
    items: {
        flashcards: Flashcard[];
        StudySession: StudySession[];
        subject: string;
        id: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
        title: string;
        topic: string;
    }[];
    totalCount: number;
}

export default function StudySessionsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();

    const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [decks, setDecks] = useState<DeckResponse['items']>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const [openEditDate, setOpenEditDate] = useState(false)
    const [editDateProps, setEditDateProps] = useState<{ initialDate: Date, sessionId: string }>({ initialDate: new Date(), sessionId: "" })

    const [allSessions, setAllSessions] = useState<(StudySession & { deck?: { title?: string; topic?: string } | null })[]>([]);
    const [delayedSessions, setDelayedSessions] = useState<(StudySession & { deck?: { title?: string; topic?: string } | null })[]>([]);
    const [scheduledSessions, setScheduledSessions] = useState<(StudySession & { deck?: { title?: string; topic?: string } | null })[]>([]);
    const [inCourseSessions, setInCourseSessions] = useState<(StudySession & { deck?: { title?: string; topic?: string } | null })[]>([]);
    const [historySessions, setHistorySessions] = useState<(StudySession & { deck?: { title?: string; topic?: string } | null })[]>([]);
    const [restart, setRestart] = useState<boolean>(false);

    const handleOpenDetail = (session: StudySession) => {
        setSelectedSession(session);
        setIsDialogOpen(true);
    };

    const handleOpenEditDate = (date: Date, sessionId: string) => {
        setEditDateProps({ initialDate: date, sessionId });
        setOpenEditDate(true)
    }

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const res = await fetch('/api/resources/decks?all=true');
                const data: DeckResponse = await res.json();
                setDecks(data.items);
                setTotalCount(data.totalCount);
                setAllSessions(data.items.flatMap((deck) =>
                    deck.StudySession.map((s) => ({
                        ...s,
                        deck: { title: deck.title, topic: deck.topic },
                    }))
                ))
            } catch (e) {
                console.error('Error cargando decks', e);
            } finally {
                setLoading(false);
            }
        };
        fetchDecks();
    }, []);

    const handleCreateSession = async (deckId: string, userId: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/study-session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deckId, userId })
            })

            if (!res.ok) {
                console.error('Error creando sesión', await res.text());
                return;
            }

            const { session } = await res.json()

            router.push(`/home/study-session?sessionId=${session.id}`);
        } catch (error: unknown) {
            console.error('Error creando sesión', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setDelayedSessions(
            allSessions.filter((s) => {
                if (s.status === "Finalizada" || !s.dateReview) return false;
                return new Date(s.dateReview).getTime() < new Date().getTime();
            })
        );
        setScheduledSessions(allSessions.filter(
            (s) =>
                s.status === 'Programada' &&
                s.dateReview &&
                new Date(s.dateReview).getTime() >= new Date().getTime()
        ))
        setInCourseSessions(allSessions.filter((s) => s.status === 'En_Curso'))
        setHistorySessions(allSessions)
    }, [allSessions, restart])


    const decksWithoutSession = decks.filter((m) => m.StudySession.length === 0);

    const statusColor = (status: string) => {
        if (status === 'En_Curso') return 'text-blue-600 bg-blue-100';
        if (status === 'Programada') return 'text-orange-600 bg-yellow-100';
        if (status === 'Finalizada') return 'text-green-600 bg-green-100';
        return 'text-orange-600';
    };

    const handleUpdateScheduledTime = async (sessionId: string, newDate: Date): Promise<boolean> => {
        const index = allSessions.findIndex(s => s.id === sessionId);
        if (index === -1) return false;
        allSessions[index].dateReview = newDate;
        setRestart((prev) => !prev)
        try {
            const res = await fetch(`/api/study-session/${sessionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dateReview: newDate }),
            });

            if (!res.ok) {
                console.error(`PATCH failed with status ${res.status}`);
                return false;
            }

            const data: { success?: boolean;[key: string]: unknown } = await res.json();
            return data.success ?? false;
        } catch (error) {
            console.error("Error in study-session id:", error);
            return false;
        }

    }

    if (!userId) {
        return <p className="p-4">Por favor, inicia sesión para ver tus sesiones de estudio.</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* Cabecera con total de sesiones */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Panel de sesiones
                    </h1>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                        <span className="text-gray-700 font-medium">Total de sesiones</span>
                        <span className="ml-2 text-gray-950 font-bold">{totalCount}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna izquierda */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Sesiones retrasadas */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Sesiones retrasadas</h2>
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {loading && <Loader />}
                                </div>
                                {!loading && delayedSessions.length === 0 && (
                                    <p className="text-gray-500">No hay sesiones retrasadas</p>
                                )}
                                {delayedSessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className="bg-white border-l-4 border-red-800/70 rounded-lg shadow p-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-red-800">{s.deck?.title}</h3>
                                            <p className="text-red-800">Tema: {s.deck?.topic}</p>
                                            <p className="text-red-800">
                                                Fecha programada: {new Date(s.dateReview!).toLocaleString()}
                                            </p>
                                            <p className='text-red-800'>Estado: {s.status === "En_Curso" ? "En curso" : s.status}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:w-auto w-full">
                                            <Link
                                                href={`/home/study-session?sessionId=${s.id}`}
                                                className="bg-red-800 hover:bg-red-900 transition duration-200 text-white px-4 py-2 rounded-lg text-center"
                                            >
                                                {s.status === 'En_Curso' ? 'Continuar sesión' : 'Empezar sesión'}
                                            </Link>
                                            <Button className="w-full bg-gray-200" variant="neutral" onClick={() => handleOpenEditDate(s.dateReview, s.id)}>
                                                Reprogramar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sesiones agendadas */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Sesiones agendadas</h2>
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {loading && <Loader />}
                                </div>
                                {!loading && scheduledSessions.length === 0 && (
                                    <p className="text-gray-500">No hay sesiones agendadas</p>
                                )}
                                {scheduledSessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className="bg-white border-l-4 border-orange-500 rounded-lg shadow p-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-orange-700">{s.deck?.title}</h3>
                                            <p className="text-orange-700">Tema: {s.deck?.topic}</p>
                                            <p className="text-orange-700">
                                                Fecha programada: {new Date(s.dateReview!).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:w-auto w-full">
                                            <Link
                                                href={`/home/study-session?sessionId=${s.id}`}
                                                className="bg-orange-500 hover:bg-orange-600 transition duration-200  text-white px-4 py-2 rounded-lg text-center"
                                            >
                                                Empezar sesión
                                            </Link>
                                            <Button className="w-full bg-gray-200" variant="neutral" onClick={() => handleOpenEditDate(s.dateReview, s.id)}>
                                                Reprogramar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sesiones en curso */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Sesiones en curso</h2>
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {loading && <Loader />}
                                </div>
                                {!loading && inCourseSessions.length === 0 && (
                                    <p className="text-gray-500">No hay sesiones en curso</p>
                                )}
                                {inCourseSessions.map((s) => (
                                    <div
                                        key={s.id}
                                        className="bg-white border-l-4 border-blue-500 rounded-lg shadow p-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-blue-700">{s.deck?.title}</h3>
                                            <p className="text-blue-700">Tema: {s.deck?.topic}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 sm:w-auto w-full">
                                            <Link
                                                href={`/home/study-session?sessionId=${s.id}`}
                                                className="bg-blue-500 hover:bg-blue-600 transition duration-200 text-white px-4 py-2 rounded-lg text-center"
                                            >
                                                Continuar sesión
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Columna derecha */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Mazos sin sesión</h2>
                        <div className="grid grid-cols-1 gap-4 text-gray-700 max-h-[600px] overflow-y-auto pr-2">
                            <div className="flex justify-center">
                                {loading && <Loader />}
                            </div>
                            {!loading && decksWithoutSession.length === 0 && (
                                <p className="text-gray-500">Todos los mazos tienen sesiones</p>
                            )}
                            {decksWithoutSession.map((m) => (
                                <div
                                    key={m.id}
                                    className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold">{m.title}</h3>
                                        <p className="text-gray-600">{m.topic}</p>
                                    </div>
                                    <Button className="mt-2 sm:mt-0 sm:w-auto w-full" onClick={() => handleCreateSession(m.id, userId)}>Crear sesión</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Historial */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Historial de sesiones</h2>
                    <div className="bg-white rounded-lg shadow overflow-x-auto text-gray-700">
                        <table className="w-full text-left text-sm sm:text-base">
                            <thead className="bg-gray-100">
                                <tr className='text-center'>
                                    <th className="py-2 px-4">Fecha</th>
                                    <th className="py-2 px-4">Mazo</th>
                                    <th className="py-2 px-4">Precisión</th>
                                    <th className="py-2 px-4">Duración</th>
                                    <th className="py-2 px-4">Estado</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td className="py-2 px-4 text-gray-500 flex justify-center" colSpan={6}>
                                            <Loader />
                                        </td>
                                    </tr>
                                )}
                                {!loading &&
                                    historySessions.map((h) => (
                                        <tr key={h.id} className="border-t hover:bg-gray-50 transition-colors">
                                            <td className="py-2 px-4 text-center">{h.dateReview ? new Date(h.dateReview).toLocaleDateString() : ''}</td>
                                            <td className="py-2 px-4">{h.deck?.title}</td>
                                            <td className="py-2 px-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2 relative">
                                                    <div
                                                        className="h-2 rounded-full bg-green-500"
                                                        style={{ width: `${h.accuracy}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">{h.accuracy}%</span>
                                            </td>
                                            <td className="py-2 px-4  text-center">
                                                {Math.floor((h.duration ?? 0) / 60)}:
                                                {((h.duration ?? 0) % 60).toString().padStart(2, '0')} min
                                            </td>
                                            <td className={`py-1 text-center`}>
                                                <span className={`${statusColor(h.status ?? '')} px-4 py-1 rounded-full`}>{h.status}</span>
                                            </td>
                                            <td className="py-2 px-4 flex">
                                                <Button
                                                    onClick={() =>
                                                        handleOpenDetail(h)
                                                    }
                                                    className="w-full sm:w-auto flex-grow"
                                                >
                                                    Detalle
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <EditSessionTimeDialog
                    isOpen={openEditDate}
                    onClose={() => setOpenEditDate(false)}
                    initialDateTime={editDateProps?.initialDate}
                    onSave={handleUpdateScheduledTime}
                    sessionId={editDateProps?.sessionId}
                />

                <Dialog isOpen={isDialogOpen}>
                    <SessionDetail session={selectedSession} onClose={() => setIsDialogOpen(false)} />
                </Dialog>
            </section>
        </main>
    );
}
