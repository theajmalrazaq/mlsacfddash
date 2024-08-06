import { useState, useEffect } from "react";
import { Search, File, FileDown, Eye, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import Loading from "./loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Supabase } from "./Supabase";
import { useToast } from "@/components/ui/use-toast";
import Navbarmenu from "@/components/custom/Navbar";

export default function Contactdata() {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [error, setError] = useState(null);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [responseToView, setResponseToView] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      const { data, error } = await Supabase.from("Contact_Responses").select(
        "*"
      );
      if (error) {
        setError(error);
        console.log(error);
      } else {
        setResponses(data);
        setFilteredResponses(data);
      }
      setLoading(false);
    };

    fetchResponses();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredResponses(
      responses.filter((response) =>
        Object.values(response).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseSearchTerm)
        )
      )
    );
  }, [searchTerm, responses]);

  const deleteResponse = async () => {
    if (!responseToDelete) return;
    setLoading(true);
    const { error } = await Supabase.from("Contact_Responses")
      .delete()
      .eq("id", String(responseToDelete.id));
    if (error) {
      toast({
        title: "Failed!!",
        description: "Can't Delete Response",
      });
    } else {
      setResponses((prevResponses) =>
        prevResponses.filter((response) => response.id !== responseToDelete.id)
      );
      setFilteredResponses((prevResponses) =>
        prevResponses.filter((response) => response.id !== responseToDelete.id)
      );
      setResponseToDelete(null);
      toast({
        title: "Deleted!!",
        description: "Response Deleted Successfully!!",
      });
    }
    setLoading(false);
  };

  const handleExportCSV = () => {
    let dataToExport = filteredResponses;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Name", "Email", "Subject", "Message"],
        ...dataToExport.map((response) => [
          response.Name,
          response.Email,
          response.Subject,
          response.Message,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVCF = () => {
    let dataToExport = filteredResponses;

    const vcfContent = dataToExport
      .map(
        (response) =>
          `BEGIN:VCARD\nVERSION:3.0\nFN:${response.Name}\nEMAIL:${response.Email}\nEND:VCARD`
      )
      .join("\n");

    const encodedUri = encodeURI(`data:text/vcard;charset=utf-8,${vcfContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "all_contacts.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbarmenu activetab={"contact"} />
      <CardHeader className="items-baseline md:p-6 pl-0 text-left">
        <CardTitle className="text-left">
          Manage Contact Form Responses
        </CardTitle>
        <CardDescription className="text-left">
          Manage Data of All Contact Form Responses
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-1  md:pl-6 pl-0">
        <div className="relative flex-1 md:grow-0 items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm w-fit"
            >
              <File className="h-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export As</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleExportCSV()}>
              <FileDown className="w-4 mr-2" />
              Export All as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportVCF()}>
              <FileDown className="w-4 mr-2" />
              Export All as VCF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="mt-8 h-72 scrollbar-thin overflow-y-scroll">
        <CardContent>
          {loading ? (
            <Loading />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Message
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium text-start capitalize p-0">
                        {response.Name}
                      </TableCell>
                      <TableCell className="text-start">
                        {response.Email}
                      </TableCell>
                      <TableCell className="text-start">
                        {response.Subject}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-start">
                        {response.Message.length > 80
                          ? response.Message.substring(0, 80) + "..."
                          : response.Message}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setResponseToView(response)}
                          >
                            <Eye className="w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              window.open(`mailto:${response.Email}`)
                            }
                          >
                            <Mail className="w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setResponseToDelete(response)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {error ? "Error loading responses" : "No responses found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {responseToDelete && (
          <AlertDialog
            open={Boolean(responseToDelete)}
            onOpenChange={(open) => !open && setResponseToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this response? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteResponse}
                  disabled={loading}
                  className="bg-red-600 text-white"
                >
                  {loading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {responseToView && (
          <AlertDialog
            open={Boolean(responseToView)}
            onOpenChange={(open) => !open && setResponseToView(null)}
          >
            <AlertDialogContent className="overflow-x-hidden overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Message</AlertDialogTitle>
                <AlertDialogDescription>
                  {responseToView.Message}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Card>
      <div className="text-xs w-full flex mt-6 text-muted-foreground">
        Showing
        <strong>&#160;{filteredResponses.length}&#160;</strong> responses
      </div>
      <div className="h-10 text-xs flex float-start mt-2">
        Developed by &#160;
        <a
          href="https://theajmalrazaq.github.io"
          target="_blank"
          className="text-orange-600 text-left"
        >
          <strong> Ajmal Razaq Bhatti</strong>
        </a>
      </div>
    </>
  );
}
