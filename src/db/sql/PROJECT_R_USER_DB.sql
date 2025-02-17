-- Active: 1733106386089@@218.237.144.112@3306@PROJECT_R_USER_DB
-- 사용자 테이블
CREATE TABLE IF NOT EXISTS Users
(
    user_id    VARCHAR(36)  PRIMARY KEY,
    login_id   VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255),
    last_login TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Players
(
    player_id  VARCHAR(36)  PRIMARY KEY,
    user_id    VARCHAR(36)  NOT NULL,
    nickname   VARCHAR(255) NULL,
    class_code VARCHAR(36)  NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Stats
(
    stat_id     VARCHAR(36) PRIMARY KEY,
    player_id   VARCHAR(36) NOT NULL,
    level       INT         NOT NULL,
    hp          INT         NOT NULL,
    mp          INT         NOT NULL,
    atk         INT         NOT NULL,
    def         INT         NOT NULL,
    magic       INT         NOT NULL,
    speed       FLOAT       NOT NULL,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Inventory
(
    inventory_id VARCHAR(36) PRIMARY KEY,
    player_id    VARCHAR(36) NOT NULL,
    item_id      VARCHAR(36) NOT NULL,
    stack        INT         NOT NULL,
    is_equipped  BOOLEAN     DEFAULT FALSE,
    created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS QuestProgress
(
    quest_progress_id VARCHAR(36) PRIMARY KEY,
    player_id         VARCHAR(36) NOT NULL,
    quest_id          VARCHAR(36) NOT NULL,
    progress          INT         NOT NULL,
    start_date        TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    update_date       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    finish_date       TIMESTAMP   DEFAULT NULL,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

