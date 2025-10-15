import { StudySessionStatus } from "@prisma/client";

// Convertir duración ms → min:seg
export const formatDuration = (ms: number | undefined) => {
    if (!ms) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
};

// Formatear fechas
export const formatDate = (date?: Date | string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Badge status
export const renderStatusBadge = (status?: StudySessionStatus) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
        case "En_Curso":
            return <span className={`${base} bg-blue-100 text-blue-800`}>En curso</span>;
        case "Finalizada":
            return <span className={`${base} bg-green-100 text-green-800`}>Finalizada</span>;
        case "Programada":
            return <span style={{ color: '#814E0C' }} className={`${base} bg-yellow-100`}>Programada</span>;
        default:
            return <span className={`${base} bg-gray-100 text-gray-800`}>Desconocido</span>;
    }
};

export function dateToLocalInputValue(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0")
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    return `${year}-${month}-${day}T${hours}:${minutes}`
}
