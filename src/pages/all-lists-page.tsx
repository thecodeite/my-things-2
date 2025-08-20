import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import type { AllListsQuery, CreateListMutationVariables } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { graphql } from "../graphql/gql";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { execute, queryClient } from "@/graphql/execute";

export const allListsPageQuery = graphql(/* GraphQL */ `
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

export const CreateList = graphql(/* GraphQL */ `
  mutation CreateList($listName: String!) {
    createList( listName: $listName) {
      id,
      name
    }
  }
`);

type List = NonNullable<
  NonNullable<NonNullable<AllListsQuery>["lists"]>[number]
>;

interface AllListsPageProps {
  lists: List[];
  queryKey: string;
}

export function AllListsPage({ lists, queryKey }: AllListsPageProps) {
  const [newListName, setNewListName] = useState("");

  const createList = useMutation({
    mutationFn: (variables: CreateListMutationVariables) =>
      execute(CreateList, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      // console.log("Item created successfully. Invalidated:", `list:${listId}`);
    },
  });

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
        <li className="grow flex flex-col justify-end sticky bottom-16 bg-white">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              createList.mutate({ listName: newListName });
              setNewListName("");
            }}
          >
            <Input
              placeholder="Add new list..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="mb-2 mr-2 item-input flex-grow"
            />

            <Button type="submit">Add</Button>
          </form>
        </li>
      </ul>
    </PageContainer>
  );
}
