"use server";

import { events } from "@/utils/db/schema";
import { db } from "@/utils/drizzle";
import { and, eq, inArray, ne } from "drizzle-orm";
import { SelectEvent } from "@/utils/db/schema";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    const event = await db.query.events.findFirst({
      where: eq(events.slug, slug),
    });
    // console.log("event", event);
    let similarEvents: SelectEvent[] = [];
    if (event) {
      const query = db.select({ data: events.tags }).from(events);
      console.log("query", query);
      similarEvents = await db.query.events.findMany({
        where: and(inArray(events.tags, query), ne(events.id, event?.id)),
        limit: 3,
      });
      // console.log("similarEvents", similarEvents);
      // return similarEvents;
    }
    return similarEvents;
  } catch (error) {
    console.error("Error fetching similar events:", error);
  }
};
