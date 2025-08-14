import type { LinkProps } from "@tanstack/react-router";
import { NavLink } from "./NavLink";

interface NavBarLinkProps {
  text: string;
  link: LinkProps;
}
interface NavBarProps {
  children?: React.ReactNode;
  backLink?: NavBarLinkProps;
  forwardLink?: NavBarLinkProps;
}

export function NavBar({ children, backLink, forwardLink }: NavBarProps) {
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
        <div />
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
        <div />
      )}
    </div>
  );
}
