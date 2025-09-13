'use client'

import { useState, useEffect } from 'react'
import { Deck, Flashcard, Note, Subjects } from '@prisma/client'
import { FullDeck, FullFlashcard, FullNote, Mode } from '@/types/resources';
import { Tab } from '@/types/enums';
import { Loader } from '@/components/Loader';
import Dialog from '@/components/resources/common/Dialog';
import Filters from '@/components/resources/common/Filters';
import Collection from '@/components/resources/common/Collection';
import Pagination from '@/components/resources/common/Pagination';
import Resource from '@/components/resources/Resource';
import SuccessAlert from '@/components/SuccessAlert';

export default function RepositoryPage() {
    const [show, setShow] = useState(false)
    const [item, setItem] = useState<{
        data: FullNote | FullDeck | FullFlashcard | null,
        dataType: Tab.Decks | Tab.Flashcards | Tab.Notes
    } | null>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<Mode>('view')

    const [tab, setTab] = useState<Tab>(Tab.Notes)
    // Filtros
    const [search, setSearch] = useState('')
    const [subject, setSubject] = useState('')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(12)
    // Resultados
    const [items, setItems] = useState<FullNote[] | FullDeck[] | FullFlashcard[]>([])
    const [total, setTotal] = useState(0)
    const [subjects, setSubjects] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(false)

    const totalPages = Math.ceil(total / perPage)

    const handleItemClick = (data: FullNote | FullDeck | FullFlashcard) => {
        setItem({ data, dataType: tab })
        setIsOpen(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                setItems([])
                const res = await fetch(
                    `/api/resources/${tab}?${new URLSearchParams({
                        search,
                        subject,
                        order,
                        page: page.toString(),
                        perPage: perPage.toString()
                    })}`)

                if (!res.ok) {
                    setItems([])
                    setTotal(0)
                    return
                }

                const { items, totalCount } = await res.json()

                setItems(items)
                setTotal(totalCount || 0)
                setSubjects(Object.values(Subjects))

            } catch (error) {
                console.error('Error fetching data:', error)
                setItems([])
                setTotal(0)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [tab, search, subject, order, page, perPage])

    const handleUpdate = (data: Partial<FullNote | FullDeck | FullFlashcard>) => {
        if (!data) return;
        const updatedItems = items.map(item =>
            item.id === data.id ? { ...item, ...data } : item
        ) as typeof items;
        const updateItem = updatedItems.find(item => item.id === data.id)
        setItems(updatedItems)
        if (updateItem)
            setItem({ data: updateItem, dataType: tab });
        return
    }

    const handleDelete = async (id: string) => {
        setIsOpen(false)
        setIsLoading(true)
        const res = await fetch(`/api/resources/${tab}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())

        if (!res.deleted) return;
        setIsLoading(false)
        setMode('view')
        setItem(null)
        setShow(true)
    }

    const handleRelate = ({ deck, flashcards }: { deck: Partial<Deck>, flashcards: Partial<Flashcard>[] }) => {
        if (!deck.id || !flashcards || flashcards.length === 0) return;

        fetch(`/api/resources/decks/${deck.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flashcards }),
        }).then(res => {
            if (!res.ok) throw new Error('Error relating deck')
            return res.json()
        }).then(updatedDeck => {
            setItems(prev => prev.map(item => item.id === updatedDeck.id ? updatedDeck : item) as typeof items)
            setItem({ data: updatedDeck, dataType: Tab.Decks })
        }).catch(error => {
            console.error('Error relating deck:', error)
        })
    }

    const handleCreate = (data: Partial<Note | Deck | Flashcard>) => {
        if (!data) return;

        const res = fetch(`/api/resources/${tab}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        res.then(res => {
            if (!res.ok) throw new Error('Error creating item')
            return res.json()
        }).then(newItem => {
            setItems(prev => [newItem, ...prev] as typeof items)
        }).catch(error => {
            console.error('Error creating item:', error)
        })
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6">
            <Dialog isOpen={isOpen}>
                <Resource
                    item={item}
                    setItem={setItem}
                    setIsOpen={setIsOpen}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    handleRelate={handleRelate}
                    handleCreate={handleCreate}
                    mode={mode}
                    setMode={setMode}
                />
            </Dialog>

            <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-8">Repositorio de Estudio</h1>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
                <div className="flex gap-2 sm:gap-6">
                    {Object.values(Tab).map((val) => (
                        <button
                            key={val}
                            onClick={() => {
                                setTab(val)
                                setPage(1)
                                setSearch('')
                                setSubject('')
                            }}
                            className={`text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-t-lg font-medium transition-colors ${tab === val
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'text-indigo-600 border-transparent hover:bg-indigo-100'
                                }`}
                        >
                            {val === Tab.Notes ? 'Notas' : val === Tab.Decks ? 'Mazos' : 'Flashcards'}
                        </button>
                    ))}
                </div>

                <Filters
                    search={search}
                    setSearch={setSearch}
                    setPage={setPage}
                    subject={subject}
                    setSubject={setSubject}
                    tab={tab}
                    subjects={subjects}
                    setOrder={setOrder}
                    order={order}
                    setMode={setMode}
                    setIsOpen={setIsOpen}
                    setItem={setItem}
                />
            </div>

            <Collection handleItemClick={handleItemClick} items={items} />

            {isLoading && <div className="flex items-center justify-center"><Loader /></div>}

            <Pagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                totalPages={totalPages}
            />

            <SuccessAlert
                show={show}
                buttonText="Aceptar"
                description="El recurso ha sido eliminado correctamente."
                title="Recurso eliminado"
            />
        </div>
    )
}
