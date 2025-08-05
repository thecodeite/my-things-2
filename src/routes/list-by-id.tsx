import { AllItemsPage } from "@/pages/all-items-page";
import { type RootRoute, createRoute, useParams } from "@tanstack/react-router";

function ListByIdRoute() {
  const { listId } = useParams({ strict: false }); // get listId from URL params
  return <AllItemsPage listId={listId ?? ""} />;
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/list/$listId",
    component: ListByIdRoute,
    getParentRoute: () => parentRoute,
  });
