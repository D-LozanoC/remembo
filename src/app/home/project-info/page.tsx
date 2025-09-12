// app/project-info/page.tsx (o el archivo donde tengas ProjectInfoPage)
'use client'

import { CreatorCard } from '@/components/CreatorCard'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function ProjectInfoPage() {
  const creators = [
    {
      src: '/David.jpg',
      alt: 'David Lozano',
      role: 'Developer',
      description:
        'Estudiante de sistematización de datos de la Universidad Distrital Francisco José de Caldas, último semestre, con pasión por la ciencia de datos.',
    },
    {
      src: '/Laura.jpg',
      alt: 'Laura Aponte',
      role: 'Developer',
      description:
        'Estudiante de sistematización de datos de la Universidad Distrital Francisco José de Caldas, último semestre, con pasión por la programación web.',
    },
  ]

  return (
    <section className="px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto py-10">
      {/* GRID principal: en móvil es 1 columna apilada, en escritorio 2 columnas (2/1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Metodologías: ocupa 2 columnas en desktop */}
        <main className="lg:col-span-2 space-y-8">
          <section className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Acerca de la creación del Proyecto
            </h1>

            <p className="text-gray-700 mb-4 leading-relaxed">
              En este proyecto se utilizarán tres metodologías clave:
            </p>

            <ul className="text-gray-700 list-disc pl-6 space-y-1">
              <li>RLR (Revisión de literatura rápida)</li>
              <li>SCRUM</li>
              <li>TAM (Technology Acceptance Model)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">RLR</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              La revisión de literatura rápida se empleará para obtener una visión general y actualizada del estado del arte en la
              gestión del conocimiento personal y los sistemas asociados. Esta metodología permitirá identificar y analizar las fuentes más
              relevantes de manera eficiente, soportando el objetivo de diseñar un sistema fundamentado en las mejores prácticas y tendencias
              actuales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">SCRUM</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              La metodología SCRUM será fundamental para la planificación y ejecución del desarrollo del sistema de gestión del conocimiento
              personal, asegurando que se cumplan los objetivos del proyecto dentro del plazo estipulado y con la flexibilidad necesaria para
              adaptarse a cambios o mejoras a lo largo del proceso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">TAM</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              TAM se utilizará para evaluar la aceptación y usabilidad del sistema desarrollado, asegurando que cumpla con las expectativas y
              necesidades de los usuarios finales. Esta evaluación está directamente relacionada con el objetivo de construir y validar un
              prototipo que sea efectivo y bien recibido por los estudiantes.
            </p>
          </section>
        </main>

        {/* Aside (creadores + enlaces): ocupa 1 columna en desktop */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Creadores</h3>

            <div className="grid grid-cols-1 gap-4">
              {creators.map((c, i) => (
                <CreatorCard
                  key={i}
                  name={c.alt}
                  role={c.role}
                  imageSrc={c.src}
                  description={c.description}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Información relacionada al proyecto
            </h3>
            <Link href="/home/links" className="block">
              <Button className="w-full sm:w-auto">Página de enlaces</Button>
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
