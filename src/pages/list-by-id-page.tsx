import { allListsLink } from "@/components/CommonNavLinks";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { graphql } from "@/graphql";
import { execute, queryClient } from "@/graphql/execute";
import type {
  DeleteListItemMutationVariables,
  ListWithItemsQuery,
} from "@/graphql/graphql";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

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

export const DeleteListItem = graphql(/* GraphQL */ `
  mutation DeleteListItem($listId: String!, $itemId: String!) {
    deleteListItem(listId: $listId, itemId: $itemId) 

    
  }
`);

type List = NonNullable<NonNullable<ListWithItemsQuery>["list"]>;

interface ListByIdPageProps {
  list: List;
  queryKey: string;
}

export function ListByIdPage({ list, queryKey }: ListByIdPageProps) {
  const listId = list.id;

  const listItems = (list.listItems ?? []).map((li, i) => ({
    id: li.id ?? `id-${i}`,
    name: li.name ?? "No Name",
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectedItem = listItems.find((item) => item.id === selectedItems[0]);

  function toggleSelected(id: string) {
    setSelectedItems((selected) => {
      const isSelected = selected.includes(id);
      if (isSelected) {
        return selected.filter((x) => x !== id);
      }
      return [...selected, id];
    });
  }

  const deleteItem = useMutation({
    mutationFn: (variables: DeleteListItemMutationVariables) =>
      execute(DeleteListItem, variables),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [`list:${listId}`] });
      // console.log("Item deleted successfully. Invalidated:", `list:${listId}`);
    },
  });

  const doDelete = async () => {
    for (const itemId of selectedItems) {
      const res = await deleteItem.mutateAsync({ listId, itemId });
      console.log(itemId, "res:", res);
    }
    console.log("All deleted");
    queryClient.invalidateQueries({ queryKey: [queryKey] });
    setSelectedItems([]);
  };

  return (
    <PageContainer>
      <NavBar
        backLink={allListsLink("Back to Lists")}
        forwardComponent={
          <Label>
            Edit
            <Switch
              checked={isEditing}
              onCheckedChange={(checked) => setIsEditing(checked)}
            />
          </Label>
        }
      >
        <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
      </NavBar>

      {isEditing && (
        <div className="mb-4 flex justify-end">
          <Button disabled={selectedItems.length === 0} onClick={doDelete}>
            Delete{" "}
            {selectedItems.length === 1
              ? selectedItem?.name
              : `${selectedItems.length} Items`}
          </Button>
        </div>
      )}

      <ul className="flex flex-col space-y-2">
        {listItems.map((item) => (
          <li key={item.id} className="flex flex-row items-center">
            <Button
              asChild
              variant={"outline"}
              className="mb-2 flex-grow justify-between border hover:border-black/50 transition-all duration-200 "
            >
              <Link
                to={"/list/$listId/item/$itemId"}
                params={{
                  listId: list.id ?? "",
                  itemId: item.id ?? "",
                }}
              >
                <div className="text-lg text-black">{item.name}</div>
                <ChevronRight className="size-4 text-gray-500" />
              </Link>
            </Button>
            {isEditing && (
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => toggleSelected(item.id)}
                className="mb-2 ml-2"
              />
            )}
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
