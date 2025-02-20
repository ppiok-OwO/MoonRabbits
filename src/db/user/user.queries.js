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
  CREATE_INVENTORY: 'INSERT INTO Inventories (inventory_id, player_id) VALUES (?, ?)', // inventory_id, player_id 토대로 인벤토리 생성
  ADD_PLAYER_TO_USERID: 'INSERT INTO Players (player_id, user_id) VALUES (?, ?)', // Players 테이블에 user_id만 들어간 데이터 생성
  FIND_PLAYER_BY_USER_ID: 'SELECT * FROM Players WHERE user_id = ?', // user_id로 player_id 찾기
  FIND_USER_BY_NICKNAME: 'SELECT * FROM Players WHERE nickname = ?', // nickname으로 user_id 찾기
  UPDATE_PLAYER: 'UPDATE Players SET nickname = ?, class_code = ? WHERE user_id = ?', // player 생성
  UPDATE_USER_LOGIN: 'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', // user 로그인 시, last_login 업데이트
  UPDATE_USER_LAST_LOGIN: 'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', // findEmailByUser에서 사용
};
