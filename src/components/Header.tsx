import { Link } from "@tanstack/react-router";
import { useMatches } from "@tanstack/react-router";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function Header() {
  const matches = useMatches();

  const match = matches.find(
    (match) => match.loaderData?.crumbs !== undefined,
  )?.loaderData;

  const crumbs = [...(match?.crumbs ?? [])];

  const lastCrumb = crumbs.pop();

  return (
    <header className="p-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((item) => (
            <React.Fragment key={item?.text}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link {...item.link}>{item?.text}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
          {lastCrumb && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbPage>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link {...lastCrumb.link}>{lastCrumb?.text}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbPage>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
// export default function Header() {
//   return (
//     <header className="p-2 flex gap-2 bg-white text-black justify-between">
//       <nav className="flex flex-row">
//         <div className="px-2 font-bold">
//           <Link to="/">Home</Link>
//         </div>

//         <div className="px-2 font-bold">
//           <Link to="/demo/tanstack-query">TanStack Query</Link>
//         </div>
//       </nav>
//     </header>
//   )
// }

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
