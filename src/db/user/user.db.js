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

// 스탯 row 추가
export const createStat = async (playerId) => {
  const statId = uuidv4(); // UUID 생성

  // 스탯 생성 쿼리 실행
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.CREATE_STAT, [statId, playerId]);

  return { statId, playerId }; // 새로 생성된 사용자 정보 반환
};

// Town에 접속하면 저장해둔 스탯을 DB에서 로드
export const loadStat = async (playerId) => {
  try {
    const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.LOAD_STAT, [playerId]);
    if (!rows || rows.length === 0) {
      // 만약 DB에 스탯 정보가 없다면 null 또는 기본값을 반환할 수 있음
      return null;
    }
    return rows[0]; // DB에서 가져온 스탯 정보 객체
  } catch (error) {
    console.error(`${playerId}에서 Stat을 로드하는데 실패했습니다. : `, error);
    throw error;
  }
};

export const updateStat = async (playerId, statData) => {
  try {
    // 필요한 파라미터들
    const params = [
      statData.level,
      statData.exp,
      statData.stamina,
      statData.pick_speed,
      statData.move_speed,
      statData.ability_point,
      playerId,
    ];
    const [result] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_STAT, params);
    return result;
  } catch (error) {
    console.error(`${playerId}에서 stat을 가져오는데 실패했습니다 : `, error);
    throw error;
  }
};

// 캐릭터 생성할 때 인벤토리도 생성, 인벤토리는 25개의 슬롯을 가짐(클라이언트의 인벤토리 개수에 따라 변경 가능)
export const createInventory = async (playerId) => {
  // 데이터베이스 커넥션 획득
  const connection = await pools.PROJECT_R_USER_DB.getConnection();
  try {
    // 트랜잭션 시작
    await connection.beginTransaction();

    // 인벤토리 ID 생성
    const inventoryId = uuidv4();

    // 배치 삽입을 위한 값 생성 (25개의 슬롯)
    const values = [];
    for (let slotIdx = 0; slotIdx < 25; slotIdx++) {
      values.push(inventoryId, playerId, slotIdx, 0);
    }

    // 25개의 슬롯에 대한 placeholder 생성
    const placeholderSets = new Array(25).fill('(?, ?, ?, ?)').join(', ');
    const query = `
      INSERT INTO Inventories (inventory_id, player_id, slot_idx, stack)
      VALUES ${placeholderSets}
    `;

    // 배치 삽입 쿼리 실행
    await connection.query(query, values);

    // 트랜잭션 커밋
    await connection.commit();

    return { inventoryId, playerId };
  } catch (error) {
    // 에러 발생 시 롤백 후 에러 재던짐
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
