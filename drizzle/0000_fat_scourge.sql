CREATE TYPE "public"."dialect_type" AS ENUM('North', 'Central', 'South');--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"definition" text NOT NULL,
	"dialect_type" "dialect_type" NOT NULL,
	"region_id" text,
	"usage_example" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "words_content_unaccent_idx" ON "words" USING gin (public.unaccent("content"));