import { AllItemsPage } from "@/pages/all-items-page";
import { useQuery } from "@tanstack/react-query";
import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";
import { execute, queryClient } from "../graphql/execute";
import { graphql } from "../graphql/gql";

const ListItemsQuery = graphql(/* GraphQL */ `
  query ListItems($id: String!) {
    list(id: $id) {
      id
      name
      listItems {
        id
        name
      }
    }
  }
`);

const query = (listId: string) => ({
  queryKey: [`lists:${listId}`],
  queryFn: () => execute(ListItemsQuery, { id: listId }),
});

function ListByIdRoute() {
  let { listId } = useParams({ strict: false }); // get listId from URL params
  listId = listId ?? "";

  const { data } = useQuery(query(listId));

  const list = {
    id: data?.list?.id ?? "",
    name: data?.list?.name ?? "",
  };
  const items = data?.list?.listItems?.map((item) => ({
    id: item.id ?? "",
    name: item.name ?? "",
  }));

  return <AllItemsPage list={list} items={items} />;
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

      return {
        crumbs: [
          { text: "All Lists", link: "/all-lists" },
          { text: listName, link: `/list/${listId}` },
        ],
      };
    },
  });
