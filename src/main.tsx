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
import allLists from "./routes/all-lists.tsx";
import listById from "./routes/list-by-id.tsx";

import Header from "./components/Header";

import TanStackQueryLayout from "./integrations/tanstack-query/layout.tsx";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

import App from "./App.tsx";
import editItemById from "./routes/edit-item-by-id.tsx";
import editListById from "./routes/edit-list-by-id.tsx";
import editListItemById from "./routes/edit-list-item-by-id.tsx";
import viewItemById from "./routes/view-item-by-id.tsx";

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  allLists(rootRoute),
  listById(rootRoute),
  viewItemById(rootRoute), // Ensure this is after listById to avoid conflicts
  editItemById(rootRoute), // Ensure this is after viewItemById to avoid conflicts
  editListById(rootRoute), // Ensure this is after listById to avoid conflicts
  editListItemById(rootRoute), // Ensure this is after listById to avoid conflicts
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
