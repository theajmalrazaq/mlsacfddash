"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbarmenu from "@/components/custom/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Supabase } from "@/components/custom/Supabase";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function Neweventim() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // Date as a string
  const [time, setTime] = useState("");
  const [linkPrimary, setLinkPrimary] = useState("");
  const [linkSecondary, setLinkSecondary] = useState("");
  const [location, setLocation] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { error } = await Supabase.from("events")
        .insert([
          {
            title: title || null,
            date: date || null,
            time: time || null,
            link_primary: linkPrimary || null,
            link_secondary: linkSecondary || null,
            location: location || null,
            img_url: imgUrl || null,
            description: description || null,
          },
        ])
        .select();

      if (error) {
        throw error;
      } else {
        // Optionally, reset the form fields
        setTitle("");
        setDate("");
        setTime("");
        setLinkPrimary("");
        setLinkSecondary("");
        setLocation("");
        setImgUrl("");
        setDescription("");

        toast({
          title: "Posted!!",
          description: "Event Posted Successfully",
          action: (
            <a href="https://mlsacfd.com/events.html" target="_blank">
              <ToastAction altText="View">View</ToastAction>
            </a>
          ),
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!!",
        description: "Event Failed To Post Contact Dev",
      });
    }

    setLoading(false);
  };

  const handleConfirmSubmit = () => {
    handleSubmit();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Navbarmenu activetab={"newevent"} />
      <CardHeader className="items-baseline">
        <CardTitle>Schedule New Event</CardTitle>
        <CardDescription>Schedule New Event to Website</CardDescription>
      </CardHeader>
      <Card className="mt-8 p-4 pt-8 h-96 scrollbar-thin  overflow-y-scroll">
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
            className="space-y-4"
          >
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

            <Button type="submit" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Event"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Fill in the details and click Submit to create a new event.
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
