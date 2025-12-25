CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  AS $func$
    SELECT public.unaccent('public.unaccent', $1)
  $func$  LANGUAGE sql IMMUTABLE;
