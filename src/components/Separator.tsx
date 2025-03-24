export function Separator({ text }: { text: string, bg?: string }) {
  return (
    <div className="flex items-center">
      <div className="flex-grow border-t border-white" />
      <span className={`mx-2 text-white`}>{text}</span>
      <div className="flex-grow border-t border-white" />
    </div>
  );
}
