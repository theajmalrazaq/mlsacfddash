import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginForm } from "./pages/login";
import { Home } from "./pages/home";
import { Newevent } from "./pages/Newevent";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { InductionData } from "./pages/inductiondata";
import { Members } from "./pages/members";
import { Contact } from "./pages/contact";
import { Errorpage } from "./pages/errorpage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm />,
    },
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "newevent",
      element: <Newevent />,
    },
    {
      path: "inductions",
      element: <InductionData />,
    },
    {
      path: "members",
      element: <Members />,
    },
    {
      path: "Contact",
      element: <Contact />,
    },
    {
      path: "*",
      element: <Errorpage />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
