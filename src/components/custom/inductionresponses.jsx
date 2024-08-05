import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Search,
  File,
  Mail,
  MessageCircle,
  Trash2,
  CheckCircle,
  XCircle,
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
import Loading from "./loading";
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
import { Badge } from "@/components/ui/badge";

export default function InductionResponses() {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [error, setError] = useState(null);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [responseToUpdate, setResponseToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportType, setExportType] = useState("all");
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      const { data, error } = await Supabase.from("induction_responses").select(
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
    const { error } = await Supabase.from("induction_responses")
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

  const updateResponseStatus = async (status) => {
    if (!responseToUpdate) {
      toast({
        title: "Error",
        description: "No response selected for update.",
      });
      return;
    }

    setLoading(true);
    const { error } = await Supabase.from("induction_responses")
      .update({ status })
      .eq("id", String(responseToUpdate.id));

    if (error) {
      toast({
        title: "Failed!!",
        description: "Can't Update Response Status",
      });
    } else {
      setResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.id === responseToUpdate.id
            ? { ...response, status }
            : response
        )
      );
      setFilteredResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.id === responseToUpdate.id
            ? { ...response, status }
            : response
        )
      );
      setResponseToUpdate(null);
      toast({
        title: "Updated!!",
        description: "Response Status Updated Successfully!!",
      });
    }
    setLoading(false);
  };
  const handleExportCSV = () => {
    let dataToExport = filteredResponses;

    if (exportType === "selected") {
      dataToExport = filteredResponses.filter(
        (response) => response.status === true
      );
    } else if (exportType === "rejected") {
      dataToExport = filteredResponses.filter(
        (response) => response.status === false
      );
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        [
          "Name",
          "Roll No",
          "Email",
          "Whatsapp",
          "Skills",
          "Experience",
          "Status",
        ],
        ...dataToExport.map((response) => [
          response.name,
          response.roll_no,
          response.nu_email,
          response.whatsapp_no,
          response.skills,
          response.experience,
          response.status === null
            ? "Waiting"
            : response.status
            ? "Selected"
            : "Rejected",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      exportType === "selected"
        ? "selected_responses.csv"
        : exportType === "rejected"
        ? "rejected_responses.csv"
        : "all_responses.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVCF = (type) => {
    let dataToExport = filteredResponses;

    if (type === "selected") {
      dataToExport = filteredResponses.filter(
        (response) => response.status === true
      );
    } else if (type === "rejected") {
      dataToExport = filteredResponses.filter(
        (response) => response.status === false
      );
    } else if (type === null || type === "all") {
      dataToExport = filteredResponses;
    }

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

  const confirmUpdateStatus = (response, status) => {
    setResponseToUpdate(response);
    setConfirmationStatus(status);
  };

  const handleUpdateStatus = () => {
    updateResponseStatus(confirmationStatus);
    setConfirmationStatus(null);
  };

  const handleSendEmail = (email) => {
    const link = document.createElement("a");
    link.href = `mailto:${email}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendWhatsApp = (phone) => {
    const link = document.createElement("a");
    link.href = `https://wa.me/${phone}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <CardHeader className="items-baseline md:p-6 pl-0 text-left">
        <CardTitle className="text-left">Manage Responses</CardTitle>
        <CardDescription className="text-left">
          Manage Induction Responses and their details
        </CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-1 md:pl-6 pl-0">
        <div className="relative flex-1 md:grow-0 items-center ">
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
                setExportType("all");
                handleExportCSV();
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              CSV (All)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setExportType("selected");
                handleExportCSV();
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              CSV (Selected)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setExportType("rejected");
                handleExportCSV();
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              CSV (Rejected)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setExportType("all");
                handleExportVCF("all");
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              VCF (All)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setExportType("selected");
                handleExportVCF("selected");
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              VCF (Selected)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setExportType("rejected");
                handleExportVCF("rejected");
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              VCF (Rejected)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="mt-8 h-96 overflow-scroll">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Whatsapp</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <Loading />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-red-500">
                    Error: {error.message}
                  </TableCell>
                </TableRow>
              ) : filteredResponses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No Responses Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="capitalize">
                      {response.name}
                    </TableCell>
                    <TableCell>{response.roll_no}</TableCell>
                    <TableCell>{response.nu_email}</TableCell>
                    <TableCell>{response.whatsapp_no}</TableCell>
                    <TableCell>{response.skills}</TableCell>
                    <TableCell>{response.experience}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          response.status === null
                            ? "default"
                            : response.status
                            ? "success"
                            : "destructive"
                        }
                        className={
                          response.status === true ? "bg-green-600 " : ""
                        }
                      >
                        {response.status === null
                          ? "Waiting"
                          : response.status
                          ? "Selected"
                          : "Rejected"}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                            onClick={() => confirmUpdateStatus(response, true)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmUpdateStatus(response, false)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSendEmail(response.nu_email)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSendWhatsApp(response.whatsapp_no)
                            }
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Send WhatsApp Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setResponseToDelete(response)}
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                            <span className="text-red-600">Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="text-xs w-full flex mt-6 text-muted-foreground">
        Showing <strong> &#160;1-10&#160;</strong> of
        <strong>&#160;{filteredResponses.length}&#160;</strong> responses
      </div>
      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={Boolean(responseToDelete)}
        onOpenChange={() => setResponseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the response.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResponseToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteResponse()}
              className="bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Update Status Dialog */}
      <AlertDialog
        open={Boolean(confirmationStatus !== null)}
        onOpenChange={() => setConfirmationStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {confirmationStatus ? "accept" : "reject"} this response?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus()}
              className={
                confirmationStatus
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }
            >
              {confirmationStatus ? "Accept" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
