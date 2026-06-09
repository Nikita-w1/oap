ALTER TABLE Resources ADD COLUMN ownerUserId INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_resources_ownerUserId ON Resources(ownerUserId);
