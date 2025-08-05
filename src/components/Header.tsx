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

  const matchesWithCrumbs = matches
    .filter((match) => match.loaderData?.crumbs)
    .flatMap(({ pathname, loaderData }) =>
      loaderData?.crumbs.map((crumb) => ({
        href: crumb.link || pathname,
        label: crumb.text,
      })),
    );

  const [page, ...rest] = matchesWithCrumbs.reverse();
  rest.reverse();

  return (
    <header className="p-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {rest.map((item) => (
            <React.Fragment key={item?.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
  
                <BreadcrumbLink asChild>
                  <Link to={item?.href}>{item?.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbPage>
            <BreadcrumbItem>
              <BreadcrumbLink href={page?.href}>{page?.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbPage>
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
