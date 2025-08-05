import { createRoute } from "@tanstack/react-router";

import type { RootRoute } from "@tanstack/react-router";

import { execute } from "@/graphql/execute";
import { AllListsPage, AllListsPageQuery } from "@/pages/all-lists-page";
import type { Crumbs } from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";

const query = () => ({
  queryKey: ["all-lists"],
  queryFn: () => execute(AllListsPageQuery),
});

function AllListsRoute() {
  const { data } = useQuery(query());

  return (
    <div>
      <AllListsPage result={data} />
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/all-lists",
    component: AllListsRoute,
    getParentRoute: () => parentRoute,
    loader: () => {
      const crumbs: Crumbs = [
        {
          text: "All Lists",
          link: { to: "/all-lists" },
        },
      ];

      return {
        crumbs,
      };
    },
  });
