import { execute, queryClient } from "@/graphql/execute";
import {
  SingleListItemPageQuery,
  ViewItemByIdPage,
} from "@/pages/view-item-page";
import type { Crumbs } from "@/types/crumb";
import { useQuery } from "@tanstack/react-query";
import {
  type RootRoute,
  createRoute,
  linkOptions,
  useParams,
} from "@tanstack/react-router";

const query = (listId: string, itemId: string) => ({
  queryKey: [`list:${listId}:item:${itemId}`],
  queryFn: () => execute(SingleListItemPageQuery, { listId, itemId }),
});

function EditListByIdRoute() {
  let { listId, itemId } = useParams({ strict: false });
  listId = listId ?? "";
  itemId = itemId ?? "";

  const { data } = useQuery(query(listId, itemId));

  return <ViewItemByIdPage result={data} />;
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/item/$itemId",
    component: EditListByIdRoute,
    getParentRoute: () => parentRoute,
    loader: async ({ params }) => {
      const { listId, itemId } = params;
      const data = await queryClient.fetchQuery(query(listId, itemId));
      const listName = data?.list?.name ?? "List";
      const itemName = data?.list?.listItem?.name ?? "Item";

      const crumbs: Crumbs = [
        {
          text: "All Lists",
          link: linkOptions({ to: "/all-lists" }),
        },
        {
          text: listName,
          link: linkOptions({ to: "/list/$listId", params: { listId } }),
        },
        {
          text: itemName,
          link: linkOptions({
            to: "/list/$listId/item/$itemId",
            params: { listId, itemId },
          }),
        },
      ];

      return {
        crumbs,
      };
    },
  });
