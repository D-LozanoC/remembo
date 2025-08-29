// components/CreatorCard.tsx
'use client'

import Image from 'next/image'
import React from 'react'

type Props = {
  name: string
  role?: string
  imageSrc: string
  description?: string
}

export function CreatorCard({ name, role, imageSrc, description }: Props) {
  return (
    <article className="bg-white/80 border border-gray-100 rounded-lg p-4 shadow-sm">
      {/* En móvil apila (imagen arriba) y en >=sm la imagen queda a la izquierda */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Contenedor de imagen con ancho adaptable. h-auto en la img evita distorsión */}
        <div className="w-full sm:w-28 md:w-32 flex-shrink-0">
          <Image
            src={imageSrc}
            alt={name}
            className="w-full h-auto object-contain rounded-md"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
          {role && <p className="text-sm text-gray-500 mt-1">{role}</p>}
          {description && (
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
