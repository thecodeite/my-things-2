import { Link } from "@tanstack/react-router";

interface AllItemsPageProps {
  list: {
    id: string;
    name: string;
  };

  items?: Array<{
    id: string;
    name: string;
  }>;
}

export function AllItemsPage({ list, items }: AllItemsPageProps) {
  if (!items) {
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
        {items.map((item) => (
          <li
            key={item.id}
            className={`
              border border-transparent rounded-lg p-2 pl-4 flex-grow 
              hover:border-black/50 hover:bg-gray-100 transition-all duration-200 cursor-pointer
              `}
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
