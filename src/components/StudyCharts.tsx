// components/StudyCharts.tsx
'use client'

import { BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe']

// Exportamos los componentes individualmente
interface StudyProgressData {
    date: string;
    cards?: number;
    newUsers?: number;
}

export const StudyProgressChart = ({ data }: { data: StudyProgressData[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={data[0].cards ? 'cards' : 'newUsers'} fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
)

interface DeckDistributionData {
    subject: string;
    value: number;
}

interface DeckDistributionChartProps {
    data: DeckDistributionData[];
}

export const DeckDistributionChart = ({ data }: DeckDistributionChartProps) => (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="subject"
            >
                {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
)

// Exportamos un objeto contenedor
const StudyCharts = {
    StudyProgressChart,
    DeckDistributionChart
}

export default StudyCharts