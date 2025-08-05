import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";

function EditListItemByIdRoute() {
  const { listId, itemId } = useParams({ strict: false }); // get listId and itemId from URL params
  return (
    <div>
      Edit List Item {itemId} in List {listId}
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId/item/$itemId/edit",
    component: EditListItemByIdRoute,
    getParentRoute: () => parentRoute,
  });
