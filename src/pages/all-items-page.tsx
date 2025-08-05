import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { graphql } from "../graphql/gql";

import { execute } from "../graphql/execute";

const ListItemsQuery = graphql(/* GraphQL */ `
  query ListItems($id: String!) {
    list(id: $id) {
      id
      name
      listItems {
        id
        name
        description
      }
    }
  }
`);

export function AllItemsPage({ listId }: { listId: string }) {
  const { data } = useQuery({
    queryKey: [`lists:${listId}`],
    queryFn: () => execute(ListItemsQuery, { id: listId }),
  });

  if (!data || !data.list) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  const items = data.list.listItems || [];

  return (
    <div className="flex flex-col min-h-screen  p-4 max-w-128">
      <div className="flex justify-between space-y-4 w-full">
        <Link
          to={"/all-lists"}
          className="w-16 text-blue-500 hover:underline mb-4"
        >
          &lt; Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">{data.list.name}</h1>

        <Link
          to={"/list/$listId/edit"}
          params={{ listId: data.list.id ?? "" }}
          className="w-16 text-blue-500 hover:underline mb-4 text-right"
        >
          Edit
        </Link>
      </div>
      <ul className="flex flex-col space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-black/20 bg-gray-200 rounded-lg p-2 pl-4 flex-grow hover:border-black/50 transition-all duration-200 cursor-pointer"
          >
            <Link
              to={"/list/$listId"}
              params={{ listId: item.id ?? "" }}
              className="flex justify-between "
            >
              <div className="text-lg text-black">{item.name}</div>
              <div>&gt;</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
