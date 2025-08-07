import { TextTraitEditor } from "./trait-editors/TextTraitEditor";
import { TextTraitViewer } from "./trait-viewers/TextTraitViewer";

export interface Trait {
  id: string;
  prompt: string;
  value: string;
}

export interface TraitRule {
  ruleType: string;
  data?: string;
}

export interface ViewTraitProps {
  trait: Trait;
  rule: TraitRule;
  onChange?: undefined;
}

export interface EditTraitProps {
  trait: Trait;
  rule: TraitRule;
  onChange: (newValue: string) => void;
}

export type TraitProps = ViewTraitProps | EditTraitProps;

export function TraitViewer({ trait, rule }: ViewTraitProps) {
  const { prompt } = trait;

  if (rule.ruleType === "text") {
    return <TextTraitViewer trait={trait} rule={rule} />;
  }

  const fallbackTrait = {
    ...trait,
    prompt: `Fallback for "${rule.ruleType}": ${prompt}`,
  };

  // fallback:
  return <TextTraitViewer trait={fallbackTrait} rule={rule} />;
}

export function TraitEditor({ trait, rule, onChange }: EditTraitProps) {
  const { prompt } = trait;

  if (rule.ruleType === "text") {
    return <TextTraitEditor trait={trait} rule={rule} onChange={onChange} />;
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
