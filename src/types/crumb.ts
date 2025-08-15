import { type LinkProps, linkOptions } from "@tanstack/react-router";

export interface Crumb {
  text: string;
  link: LinkProps;
}
export type Crumbs = Crumb[];

export const AllListsCrumb: Crumb = {
  text: "All Lists",
  link: {
    to: "/all-lists",
  },
};

export const ViewListCrumb = (name: string, listId: string): Crumb => ({
  text: name,
  link: linkOptions({ to: "/list/$listId", params: { listId } }),
});

export const EditListCrumb = (listId: string): Crumb => ({
  text: "Edit",
  link: linkOptions({ to: "/list/$listId/edit", params: { listId } }),
});
