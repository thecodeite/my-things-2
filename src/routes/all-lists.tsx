import { createRoute } from "@tanstack/react-router";

import type { RootRoute } from "@tanstack/react-router";

import { LoadingBanner } from "@/components/LoadingBanner";
import { execute } from "@/graphql/execute";
import { AllListsPage, AllListsPageQuery } from "@/pages/all-lists-page";
import { AllListsCrumb, type Crumbs } from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";

const query = () => ({
  queryKey: ["all-lists"],
  queryFn: () => execute(AllListsPageQuery),
});

function AllListsRoute() {
  const { data } = useQuery(query());

  if (!data) {
    return <LoadingBanner />;
  }

  const lists = (data.lists ?? []).filter(isDefinedAndNotNull);

  if (!lists || lists.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">No lists found.</span>
      </div>
    );
  }

  return (
    <div>
      <AllListsPage lists={lists} />
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/all-lists",
    component: AllListsRoute,
    getParentRoute: () => parentRoute,
    loader: () => {
      const crumbs: Crumbs = [AllListsCrumb];

      return {
        crumbs,
      };
    },
  });

function isDefinedAndNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
