import { LoadingBanner } from "@/components/LoadingBanner";
import { NotFoundBanner } from "@/components/NotFoundBanner";
import { ListByIdPage, ListWithItemsPageQuery } from "@/pages/list-by-id-page";
import { AllListsCrumb, type Crumbs, ViewListCrumb } from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";
import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";
import { execute, queryClient } from "../graphql/execute";

const makeQueryKey = (listId: string) => `lists:${listId}`;

const query = (listId: string) => ({
  queryKey: [makeQueryKey(listId)],
  queryFn: () => execute(ListWithItemsPageQuery, { id: listId }),
});

function ListByIdRouteComponent() {
  let { listId } = useParams({ strict: false }); // get listId from URL params
  listId = listId ?? "";

  const { data } = useQuery(query(listId));

  if (!data) {
    return <LoadingBanner />;
  }

  // TODO: component for missing items
  if (!data.list) {
    return <NotFoundBanner>List not found</NotFoundBanner>;
  }

  return <ListByIdPage list={data.list} queryKey={makeQueryKey(listId)} />;
}

export const ListByIdRoute = (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId",
    component: ListByIdRouteComponent,
    getParentRoute: () => parentRoute,
    loader: async ({ params }) => {
      const { listId } = params;
      const data = await queryClient.fetchQuery(query(listId));
      const listName = data?.list?.name ?? "List";

      const crumbs: Crumbs = [AllListsCrumb, ViewListCrumb(listName, listId)];

      return {
        crumbs,
      };
    },
  });
