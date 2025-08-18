import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import type { JSX } from "react";
import { TextTraitEditor } from "./traits/editors/TextTraitEditor";
import { TextTraitViewer } from "./traits/viewers/TextTraitViewer";
import { TraitViewerPromptWrapper } from "./traits/viewers/TraitViewerPromptWrapper";
import { HoverCard, HoverCardContent } from "./ui/hover-card";

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

const alertSymbol = "⚠️";

export function TraitViewer({ trait, rule }: ViewTraitProps) {
  let prompt: JSX.Element = <>{trait.prompt}</>;
  let content: JSX.Element | null = null;

  if (rule.ruleType === "text") {
    content = <TextTraitViewer trait={trait} rule={rule} />;
  }

  if (!content) {
    content = <TextTraitViewer trait={trait} rule={rule} />;

    prompt = (
      <>
        <HoverCard>
          <HoverCardTrigger>
            <span className="cursor-help">{alertSymbol}</span>
          </HoverCardTrigger>
          <HoverCardContent>
            This is a fallback rendered for the rule type: {rule.ruleType}
          </HoverCardContent>
        </HoverCard>
        {trait.prompt}
      </>
    );
  }

  return (
    <TraitViewerPromptWrapper prompt={prompt}>
      {content}
    </TraitViewerPromptWrapper>
  );
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
