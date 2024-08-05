import { useState, useEffect } from "react";
import {
  Search,
  File,
  MoreHorizontal,
  Mail,
  MessageCircle,
  Trash2,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function Membersdata() {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [error, setError] = useState(null);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      const { data, error } = await Supabase.from("members").select("*");
      if (error) {
        setError(error);
        console.log(error);
      } else {
        setResponses(data);
        setFilteredResponses(data);
      }
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
    const { error } = await Supabase.from("members")
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
        ["Name", "Roll No", "Email", "Whatsapp"],
        ...dataToExport.map((response) => [
          response.name,
          response.roll_no,
          response.nu_email,
          response.whatsapp_no,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVCF = (type) => {
    let dataToExport = filteredResponses;

    const vcfContent = dataToExport
      .map(
        (response) =>
          `BEGIN:VCARD\nVERSION:3.0\nFN:${response.name}\nTEL:${response.whatsapp_no}\nEMAIL:${response.nu_email}\nEND:VCARD`
      )
      .join("\n");

    const encodedUri = encodeURI(`data:text/vcard;charset=utf-8,${vcfContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      type === "selected"
        ? "selected_contacts.vcf"
        : type === "rejected"
        ? "rejected_contacts.vcf"
        : "all_contacts.vcf"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Navbarmenu activetab={"members"} />
      <CardHeader className="items-baseline md:p-6 pl-0 text-left">
        <CardTitle className="text-left">Manage Members</CardTitle>
        <CardDescription>Manage Data of All Chapter Members</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-1 md:pl-6 pl-0">
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
            <DropdownMenuItem
              onClick={() => {
                handleExportCSV();
              }}
            >
              <FileDown className="w-4 mr-2" />
              Export All as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleExportVCF();
              }}
            >
              <FileDown className="w-4 mr-2" />
              Export All as VCF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="mt-8 h-96 overflow-y-scroll">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Whatsapp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.length > 0 ? (
                filteredResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium text-start capitalize">
                      {response.name}
                    </TableCell>
                    <TableCell>{response.roll_no}</TableCell>
                    <TableCell>{response.nu_email}</TableCell>
                    <TableCell>{response.whatsapp_no}</TableCell>

                    <TableCell className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(`mailto:${response.nu_email}`)
                            }
                          >
                            {" "}
                            <Mail className="w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `https://wa.me/${response.whatsapp_no}`
                              )
                            }
                          >
                            <MessageCircle className="w-4 mr-2" />
                            Send WhatsApp Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setResponseToDelete(response)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 mr-2 text-red-600" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {error ? "Error loading Members" : "No Member found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                <AlertDialogAction onClick={deleteResponse} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Card>
      <div className="text-xs w-full flex mt-6 text-muted-foreground">
        Showing <strong> &#160;1-10&#160;</strong> of
        <strong>&#160;{filteredResponses.length}&#160;</strong> responses
      </div>
    </>
  );
}
