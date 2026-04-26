import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Nabvar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  //Make sure Outlet is included to render child routes properly.
  //this will be referenced by every page to render the navbar
  //don't add another component here, it will display, but break other pages
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}

export default App;
