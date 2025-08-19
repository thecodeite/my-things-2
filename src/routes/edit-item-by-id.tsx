import { LoadingBanner } from "@/components/LoadingBanner";
import { NotFoundBanner } from "@/components/NotFoundBanner";
import { execute, queryClient } from "@/graphql/execute";
import { EditItemPage, singleListItemPageQuery } from "@/pages/edit-item-page";
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
  queryFn: () => execute(singleListItemPageQuery, { listId, itemId }),
});

function EditItemByIdRouteComponent() {
  let { listId, itemId } = useParams({ strict: false });
  listId = listId ?? "";
  itemId = itemId ?? "";

  const { data } = useQuery(query(listId, itemId));

  if (!data) {
    return <LoadingBanner />;
  }

  const list = data?.list;
  const listItem = list?.listItem;

  if (!list || !listItem) {
    return <NotFoundBanner>List item not found</NotFoundBanner>;
  }

  return <EditItemPage list={list} listItem={listItem} />;
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
