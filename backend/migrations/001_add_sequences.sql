-- Migration 001: Add auto-increment sequences for tables with plain INTEGER PKs.
-- Idempotent (IF NOT EXISTS). The application also runs these at startup.
-- Run once on a fresh database.

CREATE SEQUENCE IF NOT EXISTS casemaster_caseid_seq;
ALTER TABLE casemaster ALTER COLUMN caseid SET DEFAULT nextval('casemaster_caseid_seq');
SELECT setval('casemaster_caseid_seq', COALESCE((SELECT MAX(caseid) FROM casemaster), 0), true);

CREATE SEQUENCE IF NOT EXISTS accused_accusedid_seq;
ALTER TABLE accused ALTER COLUMN accusedid SET DEFAULT nextval('accused_accusedid_seq');
SELECT setval('accused_accusedid_seq', COALESCE((SELECT MAX(accusedid) FROM accused), 0), true);

CREATE SEQUENCE IF NOT EXISTS victim_victimid_seq;
ALTER TABLE victim ALTER COLUMN victimid SET DEFAULT nextval('victim_victimid_seq');
SELECT setval('victim_victimid_seq', COALESCE((SELECT MAX(victimid) FROM victim), 0), true);
