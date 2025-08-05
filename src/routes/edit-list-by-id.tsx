import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";

function EditListByIdRoute() {
  const { listId } = useParams({ strict: false }); // get listId from URL params
  return <div>Edit List {listId}</div>;
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/edit",
    component: EditListByIdRoute,
    getParentRoute: () => parentRoute,
  });
