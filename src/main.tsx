import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import Header from "./components/Header";

import TanStackQueryLayout from "./integrations/tanstack-query/layout.tsx";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

import App from "./App.tsx";

import { AllListsRoute } from "./routes/all-lists.tsx";
import { EditItemByIdRoute } from "./routes/edit-item-by-id.tsx";
import { EditListByIdRoute } from "./routes/edit-list-by-id.tsx";
import { ListByIdRoute } from "./routes/list-by-id.tsx";
import { ViewItemByIdRoute } from "./routes/view-item-by-id.tsx";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />

      <TanStackQueryLayout />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

//   {
//     p: "/",
//     e: "",
//     c: appRoute,
//     ch: [
//       { p: "/all-lists", e: "all-lists", c: all },
//       {
//         p: "/list/$listId",
//         e: "/list/$listId",
//         c: indexRoute,
//         ch: [{ p: "/list/$listId/edit", c: editListRoute }],
//       },
//     ],
//   },
// ];

const routeTree = rootRoute.addChildren([
  indexRoute,
  AllListsRoute(rootRoute),
  ListByIdRoute(rootRoute),
  ViewItemByIdRoute(rootRoute), // Ensure this is after listById to avoid conflicts
  EditItemByIdRoute(rootRoute), // Ensure this is after viewItemById to avoid conflicts
  EditListByIdRoute(rootRoute), // Ensure this is after listById to avoid conflicts
]);

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
