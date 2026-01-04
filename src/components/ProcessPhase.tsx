interface ProcessPhaseProps {
  number: string;
  title: string;
  description: string;
  items: string[];
}

export default function ProcessPhase({
  number,
  title,
  description,
  items,
}: ProcessPhaseProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center font-bold text-2xl font-mono">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 font-light leading-relaxed mb-4">
          {description}
        </p>
        <ul className="text-sm text-gray-500 space-y-2 font-light">
          {items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
