import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import chalk from 'chalk';
import bcrypt from 'bcrypt';

// Email 기반으로 사용자 찾기
export const findUserByEmail = async (email) => {
  const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if (rows.length > 0) {
    console.log(`${chalk.green('[DB Log]')} 사용자를 찾았습니다 : `, rows[0]); // 여기서 user_id 값을 확인
    const user = toCamelCase(rows[0]);

    // updateLastLogin 메서드 추가
    user.updateLastLogin = async () => {
      // user.userId를 사용해서 마지막 로그인 시간 업데이트
      await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_USER_LAST_LOGIN, [user.userId]);
    };

    return user;
  } else {
    return null;
  }
};

// User 생성 시 DB 접근
export const createUser = async (email, password) => {
  const userId = uuidv4(); // UUID 생성
  const hashedPassword = await bcrypt.hash(password, 10);

  // 사용자 생성 쿼리 실행
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.CREATE_USER, [userId, email, hashedPassword]);

  return { userId, email }; // 새로 생성된 사용자 정보 반환
};

// user_id 기반으로 플레이어 찾기
export const findPlayerByUserId = async (userId) => {
  const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.FIND_PLAYER_BY_USER_ID, [userId]);
  if (rows.length > 0) {
    console.log(`${chalk.green('[DB Log]')} 플레이어를 찾았습니다 : ${rows[0]}`); // 여기서 player_id 값을 확인
    return toCamelCase(rows[0]);
  } else {
    return null;
  }
};

// DB에 nickname이 존재하는지 확인

// nickname 기반으로 user_id 찾기
export const findUserByNickname = async (nickname) => {
  const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.FIND_USER_BY_NICKNAME, [nickname]);
  if (rows.length > 0) {
    console.log(`${chalk.green('[DB Log]')} 사용자를 찾았습니다 : ${rows[0]}`); // 여기서 user_id 값을 확인
    return toCamelCase(rows[0]);
  } else {
    return null;
  }
};

// 캐릭터 생성 시 DB 접근
export const AddPlayerRow = async (email) => {
  const playerId = uuidv4(); // UUID 생성
  const user_id = await findUserByEmail(email);
  const userId = user_id.userId;
  // 사용자 생성 쿼리 실행
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.ADD_PLAYER_TO_USERID, [playerId, userId]);

  return { playerId, userId }; // 새로 생성된 사용자 정보 반환
};

// 캐릭터 이름과 클래스 코드를 받으면 DB에 캐릭터 생성
export const updatePlayer = async (userId, nickname, classCode) => {
  try {
    // SQL_QUERIES.UPDATE_PLAYER는 "UPDATE Players SET nickname = ?, class_code = ? WHERE user_id = ?"로 정의되어 있다고 가정합니다.
    await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_PLAYER, [nickname, classCode, userId]);
    console.log(`${chalk.green('[DB Log]')} 플레이어 업데이트 완료: ${userId}`);
    return { userId, nickname, classCode };
  } catch (error) {
    console.error(`${chalk.red('[DB Error]')} 플레이어 업데이트 실패: ${error}`);
    throw error;
  }
};

// 사용자 로그인 시, 마지막 로그인 시간 업데이트
export const updateUserLogin = async (id) => {
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};
