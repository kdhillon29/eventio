CREATE TABLE "bookings_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"venue" text NOT NULL,
	"location" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"mode" text NOT NULL,
	"audience" text NOT NULL,
	"agenda" text[] DEFAULT '{}'::text[] NOT NULL,
	"organizer" text,
	"tags" text[] DEFAULT Array[]::text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "events_table_slug_unique" UNIQUE("slug")
);
