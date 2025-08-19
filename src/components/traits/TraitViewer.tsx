import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import type { JSX } from "react";
import type { Trait, TraitRule } from "./trait-types";
import { GpsTraitViewer } from "./viewers/GpsTraitViewer";
import { TextTraitViewer } from "./viewers/TextTraitViewer";
import { TraitViewerPromptWrapper } from "./viewers/TraitViewerPromptWrapper";

export interface ViewTraitProps {
  trait: Trait;
  rule: TraitRule;
  onChange?: undefined;
}

const alertSymbol = "⚠️";

export function TraitViewer({ trait, rule }: ViewTraitProps) {
  let prompt: JSX.Element = <>{trait.prompt}</>;
  let content: JSX.Element | null = null;

  if (
    rule.ruleType === "text" ||
    rule.ruleType === "multi-line" ||
    rule.ruleType === "pick" ||
    rule.ruleType === "tag-list"
  ) {
    content = <TextTraitViewer trait={trait} rule={rule} />;
  }

  if (rule.ruleType === "gps") {
    content = <GpsTraitViewer trait={trait} rule={rule} />;
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
