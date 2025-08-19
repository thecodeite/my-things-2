import type { ViewTraitProps } from "../../Trait";

export function GpsTraitViewer({ trait }: ViewTraitProps) {
  const { value } = trait;

  if (!value) {
    return <p className="text-gray-400 italic">No value</p>;
  }

  const [longitude, latitude] = value
    .split(",")
    .map((coord) => coord.trim())
    .map((coord) => Number.parseFloat(coord).toFixed(6));

  return (
    <p className="text-gray-700">
      Long: {longitude}, Lat: {latitude}
    </p>
  );
}
