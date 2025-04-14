'use client'

import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'

// Exportamos los componentes individualmente
export const StudyProgressChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="cards" fill="#4f46e5" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)