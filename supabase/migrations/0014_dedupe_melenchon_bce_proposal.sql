-- Removes a duplicate proposal row (same title/summary/description/source,
-- created twice 30 seconds apart on 2026-09-05, likely a double form submit
-- in the admin). Keeps the earlier of the two; no measure_analyses row
-- references the one being removed.
delete from proposals where id = '51e86cdb-3c25-4024-900f-7fb7a15eb7af';
