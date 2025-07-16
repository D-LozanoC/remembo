import Image from 'next/image'

interface CreatorSectionProps {
  name: string;
  role: string;
  imageSrc: string;
  description: string;
}

export function CreatorCard({ name, role, imageSrc, description }: CreatorSectionProps) {
  return (
    <div className="flex gap-5">
      <Image src={imageSrc} width={200} height={400} alt="Creadores del proyecto" className="mb-4 rounded-lg shadow-md" />
      <div className="text-black">
        <h3>{name}</h3>
        <p>{role}</p>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  )
}
