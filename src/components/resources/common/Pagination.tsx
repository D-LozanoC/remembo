import { paginationProps } from "@/types/props"

export default function Pagination({
    page,
    setPage,
    perPage,
    setPerPage,
    totalPages
}: paginationProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4 text-indigo-600 font-semibold w-full">
            <div className="flex gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-4 py-2 rounded disabled:opacity-50"
                >
                    ⬅
                </button>
                <span>
                    Página {page} de {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="px-4 py-2 rounded disabled:opacity-50"
                >
                    ➡
                </button>
            </div>

            <select
                value={perPage}
                onChange={(e) => {
                    setPerPage(parseInt(e.target.value, 10))
                    setPage(1)
                }}
                className="w-full sm:w-auto ml-0 sm:ml-4 px-4 py-2 border rounded-lg"
            >
                {[6, 12, 24, 48].map((n) => (
                    <option key={n} value={n}>
                        {n} por página
                    </option>
                ))}
            </select>
        </div>
    )
}
