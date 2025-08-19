import type { EditTraitProps } from "@/components/traits/TraitEditor";
import { Label } from "@/components/ui/label";
import { fromKeyValueString } from "@/lib/keyValueString";

export function PickTraitEditor({ trait, rule, onChange }: EditTraitProps) {
  const { prompt, value } = trait;
  const { data } = rule;

  const htmlFor = `html-for-${trait.id}`;

  const options: Array<[string, string]> = Object.entries(
    fromKeyValueString(data || ""),
  );

  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor={htmlFor} className="font-bold">
        {prompt}
      </Label>

      <select
        name={htmlFor}
        id={htmlFor}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
