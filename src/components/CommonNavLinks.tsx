import type { NavBarLinkProps } from "./NavBar";

export function allListsLink(text: string): NavBarLinkProps {
  return {
    text,
    link: { to: "/all-lists" }, // Placeholder, will be updated in context
  };
}

export function viewListLink(text: string, listId: string): NavBarLinkProps {
  return {
    text,
    link: { to: "/list/$listId", params: { listId } }, // Placeholder, will be updated in context
  };
}

export function editListLink(text: string, listId: string): NavBarLinkProps {
  return {
    text,
    link: { to: "/list/$listId/edit", params: { listId } }, // Placeholder, will be updated in context
  };
}

export function viewItemLink(
  text: string,
  listId: string,
  itemId: string,
): NavBarLinkProps {
  return {
    text,
    link: { to: "/list/$listId/item/$itemId", params: { listId, itemId } },
  };
}

export function editItemLink(
  text: string,
  listId: string,
  itemId: string,
): NavBarLinkProps {
  return {
    text,
    link: { to: "/list/$listId/item/$itemId/edit", params: { listId, itemId } },
  };
}
