import {
  allListsLink,
  editItemLink,
  editListLink,
  viewItemLink,
  viewListLink,
} from "@/components/CommonNavLinks";
import type { NavBarLinkProps } from "@/components/NavBar";

export type Crumb = NavBarLinkProps;
export type Crumbs = Crumb[];

export const AllListsCrumb: Crumb = allListsLink("All Lists");

export const ViewListCrumb = viewListLink;

export const EditListCrumb = (listId: string) => editListLink("Edit", listId);

export const ViewListItemCrumb = viewItemLink;

export const EditListItemCrumb = (listId: string, itemId: string) =>
  editItemLink("Edit Item", listId, itemId);
