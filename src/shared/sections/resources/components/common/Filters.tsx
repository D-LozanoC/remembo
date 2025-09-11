import { Tab } from "@/types/enums"
import { filtersProps } from "@/types/props"

export default function Filters({
    search,
    setSearch,
    setPage,
    subject,
    setSubject,
    tab,
    subjects,
    setOrder,
    order,
    setMode,
    setIsOpen,
    setItem
}: filtersProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-end gap-4 w-full grow">
            <input
                type="text"
                placeholder="Buscar..."
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-indigo-100 text-indigo-800 placeholder-indigo-400 shadow-sm"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
            />

            {(tab === Tab.Notes || tab === Tab.Decks) && (
                <select
                    value={subject}
                    onChange={(e) => {
                        setSubject(e.target.value)
                        setPage(1)
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-indigo-300 text-indigo-800 rounded-lg shadow-sm"
                >
                    <option value="">Todas las materias</option>
                    {subjects.map((s) => (
                        <option key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
            )}

            <button
                onClick={() => {
                    setMode('create')
                    setItem({ data: null, dataType: tab })
                    setIsOpen(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
                {tab === Tab.Notes ? 'Nueva Nota' : tab === Tab.Decks ? 'Nuevo Mazo' : 'Nueva Flashcard'}
            </button>

            <button
                onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                className="w-full sm:w-auto px-4 py-2 text-indigo-600 font-bold border border-indigo-300 rounded-lg hover:bg-indigo-100 transition duration-200"
            >
                {order === 'asc' ? '↑ A-Z' : '↓ Z-A'}
            </button>
        </div>
    )
}