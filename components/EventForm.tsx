"use client";

import { object, z } from "zod";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createInsertSchema } from "drizzle-zod";
import { events } from "@/utils/db/schema";
import slugify from "react-slugify";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader, TrashIcon } from "lucide-react";
import ImageUploader from "./ImageUploader";
import Image from "next/image";
import { supabase } from "./ImageUploader";
// --------------------
// ZOD SCHEMA
// --------------------
const eventSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  slug: z.string().optional(),

  // .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  //   message: "Slug must be in lowercase with dashes between words",
  // }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  image: z.string().min(1, { message: "Image must be a valid URL" }),
  venue: z.string().min(1, { message: "Venue is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  mode: z.string().min(1, { message: "Event mode is required" }),
  audience: z.string().min(1, { message: "Audience is required" }),
  agenda: z.array(
    z.string().min(1, { message: "Agenda item cannot be empty" })
  ),
  organizer: z.string().min(1, { message: "Organizer is required" }),
  tags: z.array(z.string().min(1, { message: "Tag cannot be empty" })),
});
// const insertEventSchema = createInsertSchema(events);
type EventFormData = z.infer<typeof eventSchema>;

// --------------------
// COMPONENT
// --------------------

export default function EventForm() {
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      image: "",
      venue: "",
      location: "",
      date: "",
      time: "",
      mode: "",
      audience: "",
      organizer: "",
      agenda: [""],
      tags: [""],
    },
  });
  // const { setValue } = useFormContext();
  // const { title } = form.getValues();
  // form.setValue("slug", slugify(title));
  // console.log(title);
  const {
    fields: agendaFields,
    append: appendAgenda,
    remove: removeAgenda,
  } = useFieldArray({
    control: form.control,
    name: "agenda" as never,
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags" as never,
  });
  function objectToFormData(obj: EventFormData) {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    return formData;
  }
  async function onSubmit(values: EventFormData) {
    console.log("form data", values);

    // POST request
    const formData = objectToFormData(values);

    console.log("form data 2 ", formData);
    const response = await fetch("/api/events", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      // throw new Error("Failed to create event");
      toast.error("Failed to create event");
      return;
    }
    form.reset();
    toast.success("Event created successfully");
    setTimeout(() => {
      redirect("/");
    }, 1000);
    console.log(await response.json());
  }

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">Create New Event</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SLUG */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="event-title-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the event..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* IMAGE URL */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <ImageUploader
                    bucket="eventio"
                    folder="uploads"
                    onUpload={(url: string) => form.setValue("image", url)}
                    {...field}
                  />
                  {/* <Input
                    placeholder="https://example.com/event.jpg"
                    {...field}
                  /> */}
                </FormControl>
                {field.value && (
                  <div className="w-48 h-48 relative mt-4">
                    <Image
                      src={field.value}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="Uploaded"
                      className="w-full h-full object-cover aspect-square rounded shadow"
                    />
                    {field.value && (
                      <TrashIcon
                        size={28}
                        className="absolute top-0 right-0 h-6 w-6 text-2xl p-1 bg-green-600 rounded-full cursor-pointer"
                        onClick={async () => {
                          try {
                            const img = field.value.split("/").pop();
                            console.log("Removing file:", img);
                            await supabase.storage
                              .from("eventio")
                              .remove(["uploads/" + img]);

                            form.setValue("image", "");
                          } catch (error) {
                            console.error("Error removing file:", error);
                          }
                        }}
                      />
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VENUE */}
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input placeholder="Venue name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* LOCATION */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* TIME */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* MODE */}
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Mode</FormLabel>
                <FormControl>
                  <Input placeholder="Online / Offline / Hybrid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AUDIENCE */}
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audience</FormLabel>
                <FormControl>
                  <Input placeholder="Students, Developers, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ORGANIZER */}
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Input placeholder="Organizer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AGENDA ARRAY */}
          <div className="space-y-2">
            <FormLabel>Agenda (Array)</FormLabel>
            {agendaFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...form.register(`agenda.${index}`)}
                  placeholder={`Agenda item #${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeAgenda(index)}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendAgenda("")}
              variant="secondary"
            >
              Add Agenda Item
            </Button>
          </div>

          {/* TAGS ARRAY */}
          <div className="space-y-2">
            <FormLabel>Tags (Array)</FormLabel>
            {tagFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...form.register(`tags.${index}`)}
                  placeholder={`Tag #${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeTag(index)}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendTag("")}
              variant="secondary"
            >
              Add Tag
            </Button>
          </div>

          <Button type="submit" className="w-full  bg-purple-600">
            {form.formState.isSubmitting ? (
              <>
                <Loader className="animate-spin" /> Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
