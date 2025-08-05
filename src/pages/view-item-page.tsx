import { graphql } from "@/graphql";
import type { SingleListItemQuery } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";

export const SingleListItemPageQuery = graphql(/* GraphQL */ `
  query SingleListItem($listId: String!, $itemId: String!) {
    list(id: $listId, listItemId: $itemId) {
      id
      name
      rules {
        backing
        backingName
        data
        name
        prompt
        required
        ruleType
      }
      listItem {
        id
        name
        tags
        details {
          name
          value
        }
      }
    }
  }
`);

interface ViewItemByIdProps {
  result?: SingleListItemQuery;
}

export function ViewItemByIdPage({ result }: ViewItemByIdProps) {
  const { list } = result ?? {};
  const { listItem } = list ?? {};

  if (!list || !listItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen  p-4 max-w-128">
      <div className="flex justify-between space-y-4 w-full">
        <Link
          to={"/list/$listId"}
          params={{ listId: list.id ?? "" }}
          className="w-16 text-blue-500 hover:underline mb-4"
        >
          &lt; Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">{listItem.name}</h1>

        <Link
          to={"/list/$listId/edit"}
          params={{ listId: list.id ?? "" }}
          className="w-16 text-blue-500 hover:underline mb-4 text-right"
        >
          Edit
        </Link>
      </div>
      <div>
        <pre>{JSON.stringify(listItem, null, 2)}</pre>
        <pre>{JSON.stringify({ ...list, listItem: undefined }, null, 2)}</pre>
      </div>
    </div>
  );
}
