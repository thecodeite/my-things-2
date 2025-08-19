import { allListsLink, editListLink } from "@/components/CommonNavLinks";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { graphql } from "@/graphql";
import { execute, queryClient } from "@/graphql/execute";
import type {
  CreateListItemMutationVariables,
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

export const CreateListItem = graphql(/* GraphQL */ `
  mutation CreateListItem($listId: String!, $name: String!) {
    createListItem(listId: $listId, name: $name) {
      id
      name
    }
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
  const [newItemName, setNewItemName] = useState("");

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

  const createListItem = useMutation({
    mutationFn: (variables: CreateListItemMutationVariables) =>
      execute(CreateListItem, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      // console.log("Item created successfully. Invalidated:", `list:${listId}`);
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
        forwardLink={editListLink("Edit List", listId)}
      >
        <h1 className="text-2xl font-bold mb-4">{list.name}</h1>
        <Label>
          Edit items
          <Switch
            checked={isEditing}
            onCheckedChange={(checked) => setIsEditing(checked)}
          />
        </Label>
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

      <ul className="flex flex-col space-y-2 grow">
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
        <li className="grow flex flex-col justify-end sticky bottom-16 bg-white">
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();
              createListItem.mutate({ listId, name: newItemName });
              setNewItemName("");
            }}
          >
            <Input
              placeholder="Add new item..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="mb-2 mr-2 item-input flex-grow"
            />

            <Button type="submit">Add</Button>
          </form>
        </li>
      </ul>
    </PageContainer>
  );
}
