export const SQL_QUERIES = {
  FIND_USER_BY_EMAIL: 'SELECT * FROM Users WHERE email = ?', // email로 user_id 찾기
  CREATE_USER: 'INSERT INTO Users (user_id, email, password) VALUES (?, ?, ?)', // user 생성
  // 스탯 관련 SQL
  CREATE_STAT: 'INSERT INTO Stats (stat_id, player_id) VALUES (?, ?)', // stat_id, player_id 토대로 인벤토리 생성
  LOAD_STAT:
    'SELECT level, exp, stamina, pick_speed, move_speed, ability_point FROM Stats WHERE player_id = ?',
  UPDATE_STAT:
    'UPDATE Stats SET level = ?, exp = ?, stamina = ?, pick_speed = ?, move_speed = ?, ability_point = ? WHERE player_id = ?',
  // 인벤토리 관련 SQL
  CREATE_INVENTORY:
    'INSERT INTO Inventories (inventory_id, player_id) VALUES (?, ?)', // inventory_id, player_id 토대로 인벤토리 생성
  SEARCH_INVENTORY:
    'SELECT inventory_id FROM Inventories WHERE player_id = ? LIMIT 1', // player_id를 사용해서 inventory 탐색
  SEARCH_ALL_INVENTORY:
    'SELECT * FROM Inventories WHERE player_id = ? ORDER BY slot_idx ASC',
  UPDATE_INVENTORY:
    'UPDATE Inventories SET item_id = ?, stack = ? WHERE inventory_id = ? AND slot_idx = ?', // 인벤토리에 들어갈 데이터들 순서대로 MySQL에 업데이트
  ADD_PLAYER_TO_USERID:
    'INSERT INTO Players (player_id, user_id) VALUES (?, ?)', // Players 테이블에 user_id만 들어간 데이터 생성
  FIND_PLAYER_BY_USER_ID: 'SELECT * FROM Players WHERE user_id = ?', // user_id로 player_id 찾기
  FIND_USER_BY_NICKNAME: 'SELECT * FROM Players WHERE nickname = ?', // nickname으로 user_id 찾기
  UPDATE_PLAYER:
    'UPDATE Players SET nickname = ?, class_code = ? WHERE user_id = ?', // player 생성
  UPDATE_USER_LOGIN:
    'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', // user 로그인 시, last_login 업데이트
  UPDATE_USER_LAST_LOGIN:
    'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', // findEmailByUser에서 사용
  FIND_STAT_BY_PLAYERID: 'SELECT * FROM Stats WHERE player_id = ?',
  UPDATE_STAT_EXP: 'UPDATE Stats SET exp = ? WHERE player_id = ?',
  UPDATE_STAT_LEVEL:
    'UPDATE Stats SET level = ?, exp = ?, ability_point = ? WHERE player_id = ?',
  UPDATE_STAT:
    'UPDATE Stats SET stamina = ?, pick_speed = ?, move_speed = ?, ability_point = ? WHERE player_id = ?',
  TAKE_RANKING_DATA:
    'SELECT p.player_id, p.nickname, s.exp FROM Players p JOIN Stats s ON p.player_id = s.player_id ORDER BY s.exp DESC',
  SAVE_HOUSING_DATA:
    'INSERT INTO Players (item_id, player_id, data_type, posX, posY, posZ, rot) VALUES (?, ?, ?, ?, ?, ?, ?)',
  LOAD_HOUSING_DATA:
    'SELECT item_id, data_type, posX, poxY, posZ, rot FROM SaveHousing WHERE player_id = ?',
  DELETE_OLD_HOUSING_DATA: 'DELETE FROM SaveHousing WHERE player_id = ?',
};
