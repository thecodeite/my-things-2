import type { AllListsQuery } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";
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

interface AllListsPageProps {
  result?: AllListsQuery;
}

export function AllListsPage({ result }: AllListsPageProps) {
  if (!result || !result.lists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  const lists = result.lists.filter((list) => list !== null);

  if (lists.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">No lists found.</span>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-stretch min-h-screen  p-4 max-w-128">
      <ul className="flex flex-col space-y-2 flex-grow">
        {lists.map((list) => (
          <li
            key={list.id}
            className="border border-black/20 bg-gray-200 rounded-lg p-2 pl-4 flex-grow hover:border-black/50 transition-all duration-200 cursor-pointer"
          >
            <Link
              to={"/list/$listId"}
              params={{ listId: list.id }}
              className="flex justify-between "
            >
              <div className="text-lg text-black">
                {list.name} ({list.listItems?.length ?? 0})
              </div>
              <div>&gt;</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
