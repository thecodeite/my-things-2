import { allListsLink } from "@/components/CommonNavLinks";
import { LoadingBanner } from "@/components/LoadingBanner";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
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
    <PageContainer>
      <NavBar backLink={allListsLink("Back to Lists")}>
        <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
      </NavBar>

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
    </PageContainer>
  );
}
