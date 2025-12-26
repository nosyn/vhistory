CREATE TYPE "public"."region_level" AS ENUM('broad', 'subregion', 'province');--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"level" "region_level" NOT NULL,
	"parent_region_id" uuid,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "words_content_unaccent_idx";--> statement-breakpoint
ALTER TABLE "words" ALTER COLUMN "region_id" SET DATA TYPE uuid USING region_id::uuid;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "pronunciation" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "etymology" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "regions_parent_idx" ON "regions" USING btree ("parent_region_id");--> statement-breakpoint
CREATE INDEX "regions_code_idx" ON "regions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "words_content_unaccent_idx" ON "words" USING gin (public.immutable_unaccent("content") gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "words_region_idx" ON "words" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "words_dialect_idx" ON "words" USING btree ("dialect_type");--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_parent_region_id_regions_id_fk" FOREIGN KEY ("parent_region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "words" ADD CONSTRAINT "words_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;