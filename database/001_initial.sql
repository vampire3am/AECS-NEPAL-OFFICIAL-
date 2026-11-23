CREATE TABLE IF NOT EXISTS enquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL UNIQUE,
 reference text NOT NULL UNIQUE, name text NOT NULL CHECK(length(name) BETWEEN 2 AND 100),
 phone text NOT NULL, email text NOT NULL DEFAULT '', service text NOT NULL,
 destination text NOT NULL, meeting_mode text NOT NULL, preferred_date date,
 note text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','scheduled','closed')),
 consent_at timestamptz NOT NULL DEFAULT now(), privacy_version text NOT NULL DEFAULT '2026-11-23',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status,created_at DESC);
CREATE TABLE IF NOT EXISTS request_limits (key text PRIMARY KEY, count integer NOT NULL DEFAULT 1, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS staff_audit (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, actor text NOT NULL, enquiry_id uuid REFERENCES enquiries(id), action text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON enquiries,request_limits,staff_audit FROM PUBLIC;
COMMENT ON TABLE enquiries IS 'Server-only AECS counselling requests. No browser database access or public Data API.';

