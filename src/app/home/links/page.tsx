'use client'

import { BsFillTrash2Fill as FillTrash } from "react-icons/bs"

export default function LinksPage() {
  const links = [
    {
      title: 'Repositorio del proyecto',
      url: 'https:',
      category: 'Repositorio',
      description: 'Accede al código fuente y documentación del proyecto en GitHub.'
    },
    {
      title: 'Repositorio del proyecto',
      url: 'https:',
      category: 'Repositorio',
      description: 'Accede al código fuente y documentación del proyecto en GitHub.'
    }
  ]
  return (
    <section className="pl-4 pt-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Links relativos al proyecto de grado
      </h1>
      {links.map((link, index) => (
        <div key={index} className="mt-4 p-4 bg-white shadow rounded-lg max-w-2xl flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">{link.title}</h2>
            <p className="text-gray-600 mt-1">{link.description}</p>
            <a
              href={link.url}
              className="text-blue-500 hover:underline mt-2 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ir al enlace
            </a>
          </div>
          <FillTrash
            className="text-red-500 hover:text-red-700 cursor-pointer ml-4 w-8 justify-end"
            onClick={() => {
              // Aquí puedes implementar la lógica para eliminar el enlace
              console.log(`Enlace eliminado: ${link.title}`);
            }}
          />
        </div>
      )
      )}
    </section>
  )
}