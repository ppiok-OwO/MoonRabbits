-- Active: 1733106386089@@218.237.144.112@3306@PROJECT_R_USER_DB
-- 사용자 테이블
CREATE TABLE IF NOT EXISTS Users
(
    user_id    VARCHAR(36)  PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
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
    level              INT  DEFAULT 1,
    exp                INT  DEFAULT 0,
    stamina            INT  DEFAULT 100,
    pick_speed         INT  DEFAULT 5,
    move_speed         INT  DEFAULT 1,
    ability_point      INT  DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Inventories
(
    inventory_id VARCHAR(36) NOT NULL,
    player_id    VARCHAR(36) NOT NULL,
    item_id      VARCHAR(36) NULL,
    slot_idx     INT         NOT NULL,
    stack        INT         NOT NULL DEFAULT 0,
    created_at   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (inventory_id, slot_idx),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

