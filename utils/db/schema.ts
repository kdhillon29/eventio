import {
  pgTable,
  text,
  serial,
  uuid,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
// import crypto from "node:crypto";

export const events = pgTable(
  "events_table",
  {
    //   id: uuid("id")
    //     .primaryKey()
    //     .$default(() => crypto.randomUUID()),
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    image: text("image").notNull(),
    venue: text("venue").notNull(),
    location: text("location").notNull(),
    date: text("date").notNull(),
    time: text("time").notNull(),
    mode: text("mode").notNull(),
    audience: text("audience").notNull(),
    agenda: text("agenda")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    organizer: text("organizer"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`Array[]::text[]`),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("title_idx").on(table.title),
    uniqueIndex("slug_idx").on(table.slug),
  ]
);
export const eventsRelations = relations(events, ({ many }) => ({
  bookings: many(bookings),
}));
export const bookings = pgTable(
  "bookings_table",
  {
    id: serial("id").primaryKey(),
    event_id: integer("event_id").notNull(),

    email: text("email").notNull(),
    name: text("name").notNull(),
    phone: text("phone"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("email_idx").on(table.email)]
);

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.event_id],
    references: [events.id],
  }),
}));
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;
