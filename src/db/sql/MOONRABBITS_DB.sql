-- Active: 1733106386089@@218.237.144.112@3306@MOONRABBITS_DB
-- 사용자 테이블
CREATE TABLE User (
    user_id BIGINT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    createAt DATE,
    lastLogin DATE
);

-- 플레이어 테이블
CREATE TABLE Player (
    player_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    nickname VARCHAR(255),
    classCode BIGINT,
    createAt DATE,
    updateAt DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- 플레이어 스킬 테이블
CREATE TABLE PlayerSkill (
    playerskill_id BIGINT PRIMARY KEY,
    player_id BIGINT,
    skill_id BIGINT,
    updateAt DATE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id)
);

-- 스킬 테이블
CREATE TABLE Skill (
    skill_id BIGINT PRIMARY KEY,
    stat_id BIGINT,
    skillName VARCHAR(255),
    skillEffect TEXT,
    createAt DATE,
    updateAt DATE
);

-- 스탯 테이블
CREATE TABLE Stat (
    stat_id BIGINT PRIMARY KEY,
    level BIGINT,
    maxHp BIGINT,
    maxMp BIGINT,
    atk BIGINT,
    def BIGINT,
    magic BIGINT,
    speed BIGINT,
    updateAt DATE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (skill_id) REFERENCES Skill(skill_id),
    FOREIGN KEY (monster_id) REFERENCES Monster(monster_id)
);

-- 인벤토리 테이블
CREATE TABLE Inventory (
    inventory_id BIGINT PRIMARY KEY,
    player_id BIGINT,
    item_id BIGINT,
    stack BIGINT,
    isEquip BOOLEAN,
    createAt DATE,
    updateAt DATE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);

-- 아이템 테이블
CREATE TABLE Item (
    item_id BIGINT PRIMARY KEY,
    itemCode BIGINT,
    itemName VARCHAR(255),
    itemType VARCHAR(255),
    requireLevel BIGINT,
    itemEffect TEXT,
    itemDescription TEXT,
    createAt DATE,
    updateAt DATE
);

-- 퀘스트 진행 테이블
CREATE TABLE QuestProgress (
    questProgress_id BIGINT PRIMARY KEY,
    player_id BIGINT,
    quest_id BIGINT,
    currentCount BIGINT,
    complete BOOLEAN,
    startAt DATE,
    updateAt DATE,
    finishAt DATE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (quest_id) REFERENCES Quest(quest_id)
);

-- 퀘스트 테이블
CREATE TABLE Quest (
    quest_id BIGINT PRIMARY KEY,
    npc_id BIGINT,
    questTitle VARCHAR(255),
    questDetail TEXT,
    reward_id BIGINT,
    goalCount BIGINT,
    createAt DATE,
    updateAt DATE,
    FOREIGN KEY (npc_id) REFERENCES NPC(npc_id)
);

-- 퀘스트 보상 테이블
CREATE TABLE QuestReward (
    reward_id BIGINT PRIMARY KEY,
    item_id BIGINT,
    rewardName VARCHAR(255),
    rewardDescription TEXT,
    createAt BIGINT,
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);

-- NPC 테이블
CREATE TABLE NPC (
    npc_id BIGINT PRIMARY KEY,
    npcType VARCHAR(255),
    createAt DATE,
    updateAt DATE
);

-- 몬스터 테이블
CREATE TABLE Monster (
    monster_id BIGINT PRIMARY KEY,
    monsterName VARCHAR(255),
    dungeon_id BIGINT,
    stat_id BIGINT,
    attackType VARCHAR(255),
    createAt DATE,
    FOREIGN KEY (dungeon_id) REFERENCES Dungeon(dungeon_id)
);

-- 던전 테이블
CREATE TABLE Dungeon (
    dungeon_id BIGINT PRIMARY KEY,
    dungeonCode BIGINT,
    dungeonName VARCHAR(255),
    createAt DATE,
    updateAt DATE
);

-- 드롭 아이템 테이블
CREATE TABLE DropItem (
    dropItem_id BIGINT PRIMARY KEY,
    monster_id BIGINT,
    item_id BIGINT,
    probability BIGINT,
    createAt DATE,
    updateAt DATE
    FOREIGN KEY (monster_id) REFERENCES Monster(monster_id),
    FOREIGN KEY (item_id) REFERENCES Item(item_id)
);
