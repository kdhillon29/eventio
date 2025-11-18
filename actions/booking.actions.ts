"use server";

import { db } from "@/utils/drizzle";
import { z } from "zod";
import { bookings } from "@/utils/db/schema";
import { InsertBooking } from "@/utils/db/schema";

const BookingSchema = z.object({
  event_id: z.number().min(1, "Event ID is required"),
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(7, "Phone number is too short"),
});

type initialState = { success: boolean; errors: Record<string, string[]> };
export async function EventBooking(
  prevState: initialState,
  formData: FormData
) {
  const values = {
    event_id: Number(formData.get("eventId")),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  console.log(" form values", values);
  const parsed = BookingSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const bookingData = parsed.data;

    console.log("booking Data", bookingData);
    // const booking = parsed.data as InsertBooking;
    await db.insert(bookings).values(bookingData as InsertBooking);
    // Example: DB save, email send, webhook, etc.
    console.log("Booking saved:", parsed.data);

    return { success: true, errors: {} };
  } catch (error) {
    console.error("Error saving booking:", error);
    return {
      success: false,
      errors: { _error: ["Failed to save booking"] },
    };
  }
}
