import type { LinkProps } from "@tanstack/react-router";

export interface Crumb {
  text: string;
  link: LinkProps;
}
export type Crumbs = Crumb[];
