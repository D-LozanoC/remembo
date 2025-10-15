// components/SessionDetail.tsx
import { Button } from "@/components/Button";
import { StudySession } from "@prisma/client";
import { formatDate, formatDuration, renderStatusBadge } from "../utils";

interface SessionDetailProps {
    session: (Partial<StudySession> & {
        deck?: { title?: string; topic?: string } | null;
    }) | null;
    onClose: () => void;
}

export default function SessionDetail({ session, onClose }: SessionDetailProps) {
    if (!session) return null;   

    return (
        <div className="bg-white rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {session.deck?.title ?? "Mazo sin nombre"}
                </h2>
                {renderStatusBadge(session.status)}
            </div>

            <p className="text-sm text-gray-500 mb-6">
                {session.deck?.topic ? `Tema: ${session.deck?.topic}` : "Sin tema"}
            </p>

            {/* Grid de info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="font-semibold">Fecha creación</p>
                    <p>{formatDate(session.createdAt)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="font-semibold">Próximo repaso</p>
                    <p>{formatDate(session.dateReview)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="font-semibold">Precisión</p>
                    <p>{session.accuracy ?? 0}%</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="font-semibold">Duración</p>
                    <p>{formatDuration(session.duration)}</p>
                </div>

            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
                <Button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-2"
                >
                    Cerrar
                </Button>
            </div>
        </div>
    );
}
