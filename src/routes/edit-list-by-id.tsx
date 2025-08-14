import { execute } from "@/graphql/execute";
import {
  EditListByIdPage,
  EditListWithItemsPageQuery,
} from "@/pages/edit-list-by-id-page";
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

  return <EditListByIdPage result={data} />; // Pass undefined for now, as we don't have data fetching here
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/edit",
    component: EditListByIdRoute,
    getParentRoute: () => parentRoute,
  });
