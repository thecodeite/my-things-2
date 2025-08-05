import { createRoute } from "@tanstack/react-router";

import type { RootRoute } from "@tanstack/react-router";

import { AllListsPage } from "@/pages/all-lists-page";

function AllListsRoute() {
  return (
    <div>
      <AllListsPage />
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/all-lists",
    component: AllListsRoute,
    getParentRoute: () => parentRoute,
    loader: () => {
      return {
        crumbs: [{ text: "All Lists", link: "/all-lists" }],
      };
    },
  });
