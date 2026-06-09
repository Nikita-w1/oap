CREATE INDEX IF NOT EXISTS idx_resources_type ON Resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_createdAt ON Resources(createdAt);
CREATE INDEX IF NOT EXISTS idx_ratings_resourceId ON Ratings(resourceId);
CREATE INDEX IF NOT EXISTS idx_comments_resourceId ON Comments(resourceId);
