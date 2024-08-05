"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import Loading from "./loading"; // Import your Loading component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Supabase } from "./Supabase";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function Oldevents() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [linkPrimary, setLinkPrimary] = useState("");
  const [linkSecondary, setLinkSecondary] = useState("");
  const [location, setLocation] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Set loading to true before fetching data
      const { data, error } = await Supabase.from("Events")
        .select("*")
        .order("Id", { ascending: false });
      if (error) {
        setError(error);
        console.log(error);
      } else {
        setEvents(data);
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchEvents();
  }, []);

  const handleUpdate = async () => {
    const { error } = await Supabase.from("Events")
      .update({
        title: title || null,
        date: date || null,
        time: time || null,
        link_primary: linkPrimary || null,
        link_secondary: linkSecondary || null,
        location: location || null,
        img_url: imgUrl || null,
        description: description || null,
      })
      .eq("Id", String(selectedEvent.Id));

    if (error) {
      toast({
        title: "Failed!!",
        description: "Event Update Unsuccessfull",
        action: (
          <a href="https://mlsacfd.com/events.html" target="_blank">
            <ToastAction altText="Try again">View</ToastAction>
          </a>
        ),
      });
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.Id === selectedEvent.Id
            ? {
                ...event,
                title: title || null,
                date: date || null,
                time: time || null,
                link_primary: linkPrimary || null,
                link_secondary: linkSecondary || null,
                location: location || null,
                img_url: imgUrl || null,
                description: description || null,
              }
            : event
        )
      );
      setSelectedEvent(null); // Close dialog
    }

    toast({
      title: "Updated!!",
      description: "Event Updated Succesfully!!",
      action: (
        <a href="https://mlsacfd.com/events.html" target="_blank">
          <ToastAction altText="Try again">View</ToastAction>
        </a>
      ),
    });
  };

  const deleteEvent = async () => {
    const { error } = await Supabase.from("Events")
      .delete()
      .eq("Id", String(eventToDelete.Id));
    if (error) {
      toast({
        title: "Failed!!",
        description: "Can't Delete Event",
      });
    } else {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.Id !== eventToDelete.Id)
      );
      setEventToDelete(null); // Close dialog
    }
    toast({
      title: "Deleted!!",
      description: "Event Deleted Sucessfully!!",
    });
  };

  return (
    <>
      <CardHeader className="items-baseline">
        <CardTitle>Manage Events</CardTitle>
        <CardDescription>Manage Old Events and their details</CardDescription>
      </CardHeader>
      <Card className="mt-8 h-96 overflow-y-scroll">
        <CardContent>
          {loading ? ( // Show loading component while fetching data
            <Loading />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Speaker/Host
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Event Date
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.Id}>
                      <TableCell className="font-medium text-start">
                        {event.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-start">
                        {event.speaker}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-start">
                        {event.date}
                      </TableCell>
                      <TableCell className="text-left">
                        {" "}
                        {/* Align actions to the left */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEvent(event);
                                setTitle(event.title || "");
                                setDate(event.date || ""); // Set date string directly
                                setTime(event.time || "");
                                setLinkPrimary(event.link_primary || "");
                                setLinkSecondary(event.link_secondary || "");
                                setLocation(event.location || "");
                                setImgUrl(event.img_url || "");
                                setDescription(event.description || "");
                              }}
                            >
                              <Edit className="mr-2 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEventToDelete(event)}
                            >
                              <Trash2 className="mr-2 text-red-500 w-4" />{" "}
                              <span className="text-red-600">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {error ? "Error loading events" : "No events found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {/* Render UpdateEventDialog */}
        {selectedEvent && (
          <AlertDialog
            open={Boolean(selectedEvent)}
            onOpenChange={(open) => !open && setSelectedEvent(null)}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline">Edit Event</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Update the details of the event.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
              />
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Event Date (e.g., October 06, 2023)"
              />
              <Input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Event Time"
              />
              <Input
                value={linkPrimary}
                onChange={(e) => setLinkPrimary(e.target.value)}
                placeholder="Primary Link"
              />
              <Input
                value={linkSecondary}
                onChange={(e) => setLinkSecondary(e.target.value)}
                placeholder="Secondary Link"
              />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
              <Input
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="Image URL"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdate}>
                  Update
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Render DeleteEventDialog */}
        {eventToDelete && (
          <AlertDialog
            open={Boolean(eventToDelete)}
            onOpenChange={(open) => !open && setEventToDelete(null)}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" color="red">
                Delete Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this event? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteEvent}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Card>
      <div className="text-xs w-full flex mt-6 text-muted-foreground">
        Showing <strong> &#160; 1-10 &#160; </strong> of{" "}
        <strong>&#160; {events.length}&#160; </strong> events
      </div>
    </>
  );
}
