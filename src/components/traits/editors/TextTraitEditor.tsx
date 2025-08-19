import type { EditTraitProps } from "@/components/traits/TraitEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../ui/textarea";

export function TextTraitEditor({ trait, rule, onChange }: EditTraitProps) {
  const { prompt, value } = trait;
  const { data } = rule;

  const htmlFor = `html-for-${trait.id}`;

  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor={htmlFor} className="font-bold">
        {prompt}
      </Label>

      {data === "multi-line" ? (
        <Textarea
          id={htmlFor}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          type="text"
          id={htmlFor}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
