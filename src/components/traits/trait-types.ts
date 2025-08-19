import type { EditTraitProps } from "./TraitEditor";
import type { ViewTraitProps } from "./TraitViewer";

export interface Trait {
  id: string;
  prompt: string;
  value: string;
}

export interface TraitRule {
  ruleType: string;
  data?: string;
}

export type TraitProps = ViewTraitProps | EditTraitProps;
