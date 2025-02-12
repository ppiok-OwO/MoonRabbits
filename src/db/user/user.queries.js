export const SQL_QUERIES = {
  FIND_USER_BY_EMAIL: 'SELECT * FROM Users WHERE email = ?', // email로 user_id 찾기
  CREATE_USER: 'INSERT INTO Users (user_id, email, password) VALUES (?, ?, ?)', // user 생성
  FIND_PLAYER_BY_USER_ID: 'SELECT * FROM Players WHERE user_id = ?', // user_id로 player_id 찾기
  CREATE_PLAYER:
    'INSERT INTO Players (player_id, user_id, nickname, class_code) VALUES (?, ?, ?, ?)', // player 생성
  UPDATE_USER_LOGIN: 'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', // user 로그인 시, last_login 업데이트
  UPDATE_USER_LAST_LOGIN: 'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', // findEmailByUser에서 사용
};
