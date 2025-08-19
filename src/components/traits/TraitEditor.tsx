import { PickTraitEditor } from "./editors/PickTraitEditor";
import { TextTraitEditor } from "./editors/TextTraitEditor";
import type { Trait, TraitRule } from "./trait-types";

export interface EditTraitProps {
  trait: Trait;
  rule: TraitRule;
  onChange: (newValue: string) => void;
}

export function TraitEditor({ trait, rule, onChange }: EditTraitProps) {
  const { prompt } = trait;

  if (rule.ruleType === "text") {
    return <TextTraitEditor trait={trait} rule={rule} onChange={onChange} />;
  }

  if (rule.ruleType === "pick") {
    return <PickTraitEditor trait={trait} rule={rule} onChange={onChange} />;
  }

  const fallbackTrait = {
    ...trait,
    prompt: `Fallback for "${rule.ruleType}": ${prompt}`,
    data: "multi-line",
  };

  // fallback:
  return (
    <TextTraitEditor trait={fallbackTrait} rule={rule} onChange={onChange} />
  );
}
