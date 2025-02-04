export function Separator({ text }: { text: string, bg?: string }) {
  return (
    <div className="flex items-center">
      <div className="flex-grow border-t border-indigo-600" />
      <span className={`mx-2 text-indigo-600`}>{text}</span>
      <div className="flex-grow border-t border-indigo-600" />
    </div>
  );
}
