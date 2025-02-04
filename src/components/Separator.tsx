export function Separator({ text, bg = 'bg-white' }: { text: string, bg?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-indigo-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className={`px-2 text-indigo-600 ${bg}`}>{text}</span>
      </div>
    </div>
  )
}
