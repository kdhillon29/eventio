DROP INDEX "email_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "event_email_idx" ON "bookings_table" USING btree ("event_id","email");