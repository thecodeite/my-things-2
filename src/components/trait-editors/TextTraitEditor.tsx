import type { EditTraitProps } from "../Trait";

export function TextTraitEditor({ trait, rule, onChange }: EditTraitProps) {
  const { prompt, value } = trait;
  const { data } = rule;

  return (
    <div>
      <h2 className="text-lg font-bold">{prompt}</h2>
      <textarea
        className="w-full p-2 border rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={data === "multi-line" ? 4 : 1}
      />
    </div>
  );
}
