import Link from 'next/link'

type SidebarProps = {
  tituloPrincipal: string,
  sidebarFields: Array<SidebarField>,
}

type SidebarField = {
  text: string,
  icon: string,
  href: string,
}

export function SideBar({ tituloPrincipal, sidebarFields }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-blue_100 shadow-lg md:shadow-none">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">{tituloPrincipal}</h2>
        <nav>
          <ul className="space-y-2">
            {sidebarFields.map((field, index) => (
              <li key={index}>
                <Link
                  href={field.href}
                  className="flex items-center p-3 rounded-lg text-white hover:bg-yellow_300 hover:text-black transition-colors delay-75 ease-out"
                >
                  <span className="mr-2">{field.icon}</span>
                  {field.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}