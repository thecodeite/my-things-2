import { LoadingBanner } from "@/components/LoadingBanner";
import { graphql } from "@/graphql";
import type { ListWithItemsQuery } from "@/graphql/graphql";
import { Link } from "@tanstack/react-router";

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
      <div className="flex justify-between space-y-4 w-full">
        <Link
          to={"/all-lists"}
          className="w-16 text-blue-500 hover:underline mb-4"
        >
          &lt; Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">{list.name}</h1>

        <Link
          to={"/list/$listId/edit"}
          params={{ listId: list.id ?? "" }}
          className="w-16 text-blue-500 hover:underline mb-4 text-right"
        >
          Edit
        </Link>
      </div>
      <ul className="flex flex-col space-y-2">
        {(result.list?.listItems ?? []).map((item) => (
          <li
            key={item.id}
            className={`
              border border-transparent rounded-lg p-2 pl-4 flex-grow 
              hover:border-black/50 hover:bg-gray-100 transition-all duration-200 cursor-pointer
              `}
          >
            <Link
              to={"/list/$listId/item/$itemId"}
              params={{ listId: result.list?.id ?? "", itemId: item.id ?? "" }}
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
