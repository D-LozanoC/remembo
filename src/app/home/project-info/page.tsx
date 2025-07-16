'use client'

import { CreatorCard } from '@/components/CreatorCard'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function ProjectInfoPage() {
  const creators = [
    { src: '/David.jpg', alt: 'David Lozano', role: 'Front-end developer', description: 'Estudiante de sistematización de datos de la universidad distrital Francisco José de Caldas, último semestre, con pasión por la programación web. ' },
    { src: '/Laura.jpg', alt: 'Laura Aponte', role: 'Full-stack develop', description: 'Estudiante de sistematización de datos de la universidad distrital Francisco José de Caldas, último semestre, con pasión por la ciencia de datos. ' },
  ]

  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Acerca de la creación del Proyecto
      </h1>

      <p className="text-gray-600 mb-6">
        Este proyecto fue creado por estudiantes de la Universidad Distrital Francisco José de Caldas, como parte de su formación académica en el programa de sistematización de datos. El objetivo es desarrollar una aplicación web que facilite la gestión y visualización de información relevante para los usuarios.
        Usamos metodologías ágiles como SCRUM y herramientas de desarrollo modernas para garantizar un proceso eficiente y colaborativo.
      </p>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Creadores
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-20">
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