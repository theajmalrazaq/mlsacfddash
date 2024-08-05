import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="mlsacfddash/" element={<LoginForm />} />
            <Route path="home" element={<Home />} />
            <Route path="newevent" element={<Newevent />} />
            <Route path="inductions" element={<InductionData />} />
            <Route path="members" element={<Members />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Errorpage />} />
          </Routes>
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
