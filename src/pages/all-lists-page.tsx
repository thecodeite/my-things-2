import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import type { AllListsQuery } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { graphql } from "../graphql/gql";

export const AllListsPageQuery = graphql(/* GraphQL */ `
  query AllLists {
    lists {
      id
      name
      listItems {
        id
        name
      }
    }
  }
`);

type List = NonNullable<
  NonNullable<NonNullable<AllListsQuery>["lists"]>[number]
>;

interface AllListsPageProps {
  lists: List[];
}

export function AllListsPage({ lists }: AllListsPageProps) {
  return (
    <PageContainer>
      <ul className="flex flex-col space-y-2 flex-grow">
        {lists.map((list) => (
          <li key={list.id}>
            <Button
              asChild
              variant={"secondary"}
              className="w-full mb-2 flex justify-between border hover:border-black/50 transition-all duration-200 "
            >
              <Link to={"/list/$listId"} params={{ listId: list.id }}>
                <div className="text-lg text-black">
                  {list.name} ({list.listItems?.length ?? 0})
                </div>
                <ChevronRight className="size-4 text-gray-500" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
