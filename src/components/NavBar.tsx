import type { LinkProps } from "@tanstack/react-router";
import { NavLink } from "./NavLink";

export interface NavBarLinkProps {
  text: string;
  link: LinkProps;
}
type BackwardsSlot =
  | {
      backLink?: NavBarLinkProps;
    }
  | {
      backComponent?: React.ReactNode;
    };

type ForwardsSlot =
  | {
      forwardLink?: NavBarLinkProps;
    }
  | {
      forwardComponent?: React.ReactNode;
    };

type NavBarProps = {
  children?: React.ReactNode;
} & BackwardsSlot &
  ForwardsSlot;

export function NavBar({ children, ...props }: NavBarProps) {
  const forwardLink = "forwardLink" in props ? props.forwardLink : undefined;
  const backLink = "backLink" in props ? props.backLink : undefined;

  const forwardComponent =
    "forwardComponent" in props ? props.forwardComponent : <div />;
  const backComponent =
    "backComponent" in props ? props.backComponent : <div />;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-start space-y-4 w-full">
      {backLink ? (
        <NavLink
          direction="back"
          to={backLink.link.to}
          params={backLink.link.params}
        >
          {backLink.text}
        </NavLink>
      ) : (
        backComponent
      )}

      <div className="flex flex-col items-center justify-between">
        {children}
      </div>

      {forwardLink ? (
        <NavLink
          direction="forward"
          to={forwardLink.link.to}
          params={forwardLink.link.params}
        >
          {forwardLink.text}
        </NavLink>
      ) : (
        <div className="flex justify-end">{forwardComponent}</div>
      )}
    </div>
  );
}
