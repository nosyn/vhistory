DROP INDEX "words_content_unaccent_idx";--> statement-breakpoint
CREATE INDEX "words_content_unaccent_idx" ON "words" USING gin (public.immutable_unaccent("content") gin_trgm_ops);