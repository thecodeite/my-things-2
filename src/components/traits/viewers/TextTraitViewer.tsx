import type { ViewTraitProps } from "../TraitEditor";

export function TextTraitViewer({ trait }: ViewTraitProps) {
  const { value } = trait;

  if (!value) {
    return <p className="text-gray-400 italic">No value</p>;
  }

  return <p className="text-gray-700">{value}</p>;
}
