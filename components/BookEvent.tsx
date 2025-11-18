"use client";

import { startTransition, useActionState, useEffect } from "react";
import { EventBooking } from "@/actions/booking.actions";
import { InsertBooking } from "@/utils/db/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(7, "Phone number is too short"),
});
// type initialState = { success: boolean; errors: Record<string, string[]> };
export default function BookingForm({ eventId }: { eventId: number }) {
  const [state, formAction, isPending] = useActionState(EventBooking, {
    success: false,
    errors: {},
  });

  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (state.success && !isPending) {
      form.reset();
    }
  }, [state, isPending]);

  const onSubmit = (values: z.infer<typeof BookingSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("eventId", eventId.toString());
    startTransition(() => {
      const result = formAction(formData);
      console.log("result", result);
    });
    if (state.success) {
      console.log("success reset form");
      form.reset();
    }

    // set server errors inside react-hook-form
    Object.entries(state.errors || {}).forEach(([key, val]) => {
      if (val?.[0]) {
        form.setError(key as keyof typeof state.errors, { message: val[0] });
      }
    });
  };
  return (
    <div className="max-w-md space-y-4">
      <Form {...form}>
        <form
          //   action={formAction}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 555 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Submitting..." : "Book Now"}
          </Button>
        </form>
      </Form>

      {state.success && (
        <p className="text-green-600 text-sm">
          Booking submitted successfully!
        </p>
      )}
      {state.errors && Object.values(state.errors).length > 0 && (
        <p className="text-red-600 text-sm">
          <strong>server Error:</strong>
          {Object.values(state.errors).join(", ")}
        </p>
      )}
    </div>
  );
}
