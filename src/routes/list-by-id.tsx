import { ListByIdPage, ListWithItemsPageQuery } from "@/pages/list-by-id-page";
import { AllListsCrumb, type Crumbs, ViewListCrumb } from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";
import {
  type RootRoute,
  createRoute,
  linkOptions,
  useParams,
} from "@tanstack/react-router";
import { execute, queryClient } from "../graphql/execute";

const query = (listId: string) => ({
  queryKey: [`lists:${listId}`],
  queryFn: () => execute(ListWithItemsPageQuery, { id: listId }),
});

function ListByIdRoute() {
  let { listId } = useParams({ strict: false }); // get listId from URL params
  listId = listId ?? "";

  const { data } = useQuery(query(listId));

  return <ListByIdPage result={data} />;
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId",
    component: ListByIdRoute,
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
