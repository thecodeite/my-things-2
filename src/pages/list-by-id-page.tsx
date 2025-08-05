import { LoadingBanner } from "@/components/LoadingBanner";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { graphql } from "@/graphql";
import type { ListWithItemsQuery } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const ListWithItemsPageQuery = graphql(/* GraphQL */ `
  query ListWithItems($id: String!) {
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

interface ListByIdPageProps {
  result?: ListWithItemsQuery;
}

export function ListByIdPage({ result }: ListByIdPageProps) {
  if (!result) {
    return <LoadingBanner />;
  }

  const list = result.list ?? { id: "", name: "Unknown List" };

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-128">
      <div className="flex justify-between items-center space-y-4 w-full">
        <NavLink direction="back" to={"/all-lists"} className="w-16">
          Back
        </NavLink>

        <h1 className="text-2xl font-bold mb-4">{list.name}</h1>

        <NavLink
          direction="forward"
          to={"/list/$listId/edit"}
          params={{ listId: list.id ?? "" }}
          className="w-16"
        >
          Edit
        </NavLink>
      </div>

      <ul className="flex flex-col space-y-2">
        {(result.list?.listItems ?? []).map((item) => (
          <li key={item.id}>
            <Button
              asChild
              variant={"outline"}
              className="w-full mb-2 flex justify-between border hover:border-black/50 transition-all duration-200 "
            >
              <Link
                to={"/list/$listId/item/$itemId"}
                params={{
                  listId: result.list?.id ?? "",
                  itemId: item.id ?? "",
                }}
              >
                <div className="text-lg text-black">{item.name}</div>
                <ChevronRight className="size-4 text-gray-500" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
