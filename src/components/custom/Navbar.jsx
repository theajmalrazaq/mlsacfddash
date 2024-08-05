import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Supabase } from "./Supabase";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/custom/theme-provider";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
export default function Navbarmenu(e) {
  const { setTheme } = useTheme();
  let Navigator = useNavigate();
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-50">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <span className="">MLSA CFD </span>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="home"
            className={`transition-colors hover:text-foreground ${
              e.activetab == "home"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Manage Events
          </Link>
          <Link
            to="newevent"
            className={` transition-colors hover:text-foreground ${
              e.activetab == "newevent"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Schedule Event
          </Link>
          <Link
            to="inductions"
            className={`transition-colors hover:text-foreground ${
              e.activetab == "inductions"
                ? "text-foreground"
                : "text-muted-foreground "
            }`}
          >
            Inductions Responses
          </Link>
          <Link
            to="members"
            className={` transition-colors hover:text-foreground ${
              e.activetab == "members"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Manage Members
          </Link>
          <Link
            to="contact"
            className={` transition-colors hover:text-foreground ${
              e.activetab == "contact"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Contact Form Responses
          </Link>
        </nav>
        <Sheet>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                try {
                  const { error } = await Supabase.auth.signOut();
                  if (error) {
                    console.error(error);
                  } else {
                    Navigator("/");
                  }
                } catch (error) {
                  console.error("An error occurred during sign-out:", error);
                }
              }}
            >
              <LogOut />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span>MLSA CFD</span>
              </Link>
              <Link
                to="home"
                className={`transition-colors hover:text-foreground ${
                  e.activetab == "home"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Manage Events
              </Link>
              <Link
                to="newevent"
                className={` transition-colors hover:text-foreground ${
                  e.activetab == "newevent"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Schedule Event
              </Link>
              <Link
                to="inductions"
                className={`transition-colors hover:text-foreground ${
                  e.activetab == "inductions"
                    ? "text-foreground"
                    : "text-muted-foreground "
                }`}
              >
                Inductions Respones
              </Link>
              <Link
                to="members"
                className={` transition-colors hover:text-foreground ${
                  e.activetab == "members"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Manage Members
              </Link>
              <Link
                to="contact"
                className={` transition-colors hover:text-foreground ${
                  e.activetab == "contact"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Contact Form Responses
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <div />
    </>
  );
}
