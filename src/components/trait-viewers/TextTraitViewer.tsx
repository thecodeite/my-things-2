import type { ViewTraitProps } from "../Trait";

export function TextTraitViewer({ trait }: ViewTraitProps) {
  const { prompt, value } = trait;

  return (
    <div>
      <h2 className="text-lg font-bold">{prompt}</h2>
      <p className="text-gray-500">{value}</p>
    </div>
  );
}
