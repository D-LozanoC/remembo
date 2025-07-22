'use client'

import { CreatorCard } from '@/components/CreatorCard'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function ProjectInfoPage() {
  const creators = [
    { src: '/David.jpg', alt: 'David Lozano', role: 'Developer', description: 'Estudiante de sistematización de datos de la universidad distrital Francisco José de Caldas, último semestre, con pasión por la ciencia de datos. ' },
    { src: '/Laura.jpg', alt: 'Laura Aponte', role: 'Developer', description: 'Estudiante de sistematización de datos de la universidad distrital Francisco José de Caldas, último semestre, con pasión por la programación web. ' },
  ]

  return (
    <section className="p-8 px-48">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Acerca de la creación del Proyecto
      </h1>

      <p className="text-gray-600 mb-6">
        En este proyecto se utilizarán tres metodologías clave
      </p>

      <ul className="text-gray-600 mb-6 list-disc pl-6">
        <li>RLR (Revisión de literatura rápida)</li>
        <li>SCRUM</li>
        <li>TAM (Technology Acceptance Model)</li>
      </ul>

      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        RLR
      </h3>
      <p className="text-gray-600 mb-6">
        La revisión de literatura rápida se empleará para obtener una visión general y actualizada del estado del arte
        en la gestión del conocimiento personal y los sistemas asociados. Esta metodología permitirá identificar y analizar las fuentes más
        relevantes de manera eficiente, soportando el objetivo de diseñar un sistema fundamentado en las mejores prácticas y tendencias
        actuales.
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        SCRUM
      </h3>
      <p className="text-gray-600 mb-6">
        La metodología SCRUM será fundamental para la planificación y ejecución del desarrollo del sistema de gestión del
        conocimiento personal, asegurando que se cumplan los objetivos del proyecto dentro del plazo estipulado y con la flexibilidad
        necesaria para adaptarse a cambios o mejoras a lo largo del proceso.
      </p>

      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        TAM
      </h3>
      <p className="text-gray-600 mb-6">
        TAM se utilizará para evaluar la aceptación y
        usabilidad del sistema desarrollado, asegurando que cumpla con las expectativas y necesidades de los usuarios finales. Esta
        evaluación está directamente relacionada con el objetivo de construir y validar un prototipo que sea efectivo y bien recibido por
        los estudiantes, quienes serán los principales usuarios del sistema.
      </p>

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Creadores
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6">
        {creators.map((creator, index) => (
          <CreatorCard
            key={index}
            name={creator.alt}
            role={creator.role}
            imageSrc={creator.src}
            description={creator.description}
          />
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Información relacionada al proyecto</h2>
      <Button className="w-full">
        <Link href="/home/links">Pagina de enlaces</Link>
      </Button>
    </section>
  )
}