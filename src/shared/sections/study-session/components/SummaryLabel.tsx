interface SummaryLabelProps {
  title: string;
  value: string | number;
}

export function SummaryLabel({ title, value }: SummaryLabelProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}