import { NextRequest, NextResponse } from "next/server";

import { db } from "@/utils/drizzle";
import { events, InsertEvent } from "@/utils/db/schema";
import slugify from "react-slugify";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("form data ", formData);
    let event;

    try {
      event = Object.fromEntries(formData.entries()) as unknown as InsertEvent;
      console.log("event form data ", event);
    } catch (e) {
      console.error("error ", e);
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    // const file = formData.get("image") as File;

    // if (!file)
    //   return NextResponse.json(
    //     { message: "Image file is required" },
    //     { status: 400 }
    //   );

    const tags = (formData.get("tags") as string)?.split(",");
    const agenda = (formData.get("agenda") as string)?.split(",");

    // event.image = (uploadResult as { secure_url: string }).secure_url;
    if (!event.image) event.image = "/images/event1.png";
    const slug = slugify(event.title as string);
    const eventData: InsertEvent = {
      ...event,
      slug,
      tags,
      agenda,
    };

    await db.execute(`SELECT 1`);
    console.log("Database connection successful.");
    const createdEvent = await db
      .insert(events)
      .values(eventData)
      .returning({ insertId: events.id });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error("server error ", e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const eventsData = await db.select().from(events);

    return NextResponse.json(
      { message: "Events fetched successfully", eventsData },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
