import { pgTable, text, serial, uuid, timestamp } from "drizzle-orm/pg-core";
// import crypto from "node:crypto";

export const events = pgTable("events_table", {
  //   id: uuid("id")
  //     .primaryKey()
  //     .$default(() => crypto.randomUUID()),
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull(),
  image: text("image").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
