import { execute, queryClient } from "@/graphql/execute";
import { ItemByIdPage, SingleListItemPageQuery } from "@/pages/item-page";
import {
  AllListsCrumb,
  type Crumbs,
  EditListItemCrumb,
  ViewListCrumb,
  ViewListItemCrumb,
} from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";
import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";

const query = (listId: string, itemId: string) => ({
  queryKey: [`list:${listId}:item:${itemId}`],
  queryFn: () => execute(SingleListItemPageQuery, { listId, itemId }),
});

function EditItemByIdRouteComponent() {
  let { listId, itemId } = useParams({ strict: false });
  listId = listId ?? "";
  itemId = itemId ?? "";

  const { data } = useQuery(query(listId, itemId));

  return <ItemByIdPage result={data} mode="edit" />;
}

export const EditItemByIdRoute = (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/item/$itemId/edit",
    component: EditItemByIdRouteComponent,
    getParentRoute: () => parentRoute,
    loader: async ({ params }) => {
      const { listId, itemId } = params;
      const data = await queryClient.fetchQuery(query(listId, itemId));
      const listName = data?.list?.name ?? "List";
      const itemName = data?.list?.listItem?.name ?? "Item";

      const crumbs: Crumbs = [
        AllListsCrumb,
        ViewListCrumb(listName, listId),
        ViewListItemCrumb(itemName, listId, itemId),
        EditListItemCrumb(listId, itemId),
      ];

      return {
        crumbs,
      };
    },
  });
