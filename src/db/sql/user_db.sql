CREATE TABLE IF NOT EXISTS user
(
    id         VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);