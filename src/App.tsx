import { Link } from "@tanstack/react-router";

function App() {
  return (
    <div className="text-center">
      <Link to="/all-lists" className="flex items-center justify-center">
        All Lists
      </Link>
    </div>
  );
}

export default App;
