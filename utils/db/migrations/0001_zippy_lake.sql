CREATE INDEX "email_idx" ON "bookings_table" USING btree ("email");--> statement-breakpoint
CREATE INDEX "title_idx" ON "events_table" USING btree ("title");--> statement-breakpoint
CREATE UNIQUE INDEX "slug_idx" ON "events_table" USING btree ("slug");