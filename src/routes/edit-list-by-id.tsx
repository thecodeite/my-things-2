import { LoadingBanner } from "@/components/LoadingBanner";
import { execute, queryClient } from "@/graphql/execute";
import {
  EditListByIdPage,
  EditListWithItemsPageQuery,
} from "@/pages/edit-list-by-id-page";
import {
  AllListsCrumb,
  type Crumbs,
  EditListCrumb,
  ViewListCrumb,
} from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";
import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";

const query = (listId: string) => ({
  queryKey: [`list:${listId}`],
  queryFn: () => execute(EditListWithItemsPageQuery, { id: listId }),
});

function EditListByIdRoute() {
  let { listId } = useParams({ strict: false }); // get §listId from URL params

  listId = listId ?? "";

  const { data } = useQuery(query(listId));

  if (!data) {
    return <LoadingBanner />;
  }

  if (!data.list) {
    return <div className="text-red-500">List not found</div>;
  }

  return <EditListByIdPage list={data.list} />;
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/edit",
    component: EditListByIdRoute,
    getParentRoute: () => parentRoute,
    loader: async ({ params }) => {
      const { listId } = params;
      const data = await queryClient.fetchQuery(query(listId));
      const listName = data?.list?.name ?? "List";

      const crumbs: Crumbs = [
        AllListsCrumb,
        ViewListCrumb(listName, listId),
        EditListCrumb(listId),
      ];

      return {
        crumbs,
      };
    },
  });
