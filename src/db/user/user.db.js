import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import redisClient from '../../utils/redis/redis.config.js';

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

export const updateInventory = async (playerId) => {
  try {
    // 플레이어의 인벤토리 ID 조회 (인벤토리는 이미 생성되어 있다고 가정)
    const [inventoryRows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.SEARCH_INVENTORY, [
      playerId,
    ]);
    if (!inventoryRows || inventoryRows.length === 0) {
      console.error(
        `${chalk.green('[DB Log]')} 플레이어 ${playerId}의 인벤토리 정보가 존재하지 않습니다.`,
      );
      return;
    }
    const inventoryId = inventoryRows[0].inventory_id;

    // Redis에서 인벤토리 전체 데이터를 읽어옴 (해시 형식)
    const redisKey = `inventory:${playerId}`;
    const inventoryData = await redisClient.hgetall(redisKey);
    if (!inventoryData || Object.keys(inventoryData).length === 0) {
      console.log(
        `${chalk.green('[DB Log]')} 플레이어 ${playerId}의 Redis 인벤토리가 비어 있습니다.`,
      );
      // 빈 인벤토리 상태도 MySQL에 반영할 필요가 있다면,
      // 전체 슬롯에 대해 기본값 업데이트를 진행할 수 있습니다.
      // 이 예제에서는 그냥 종료합니다.
      return;
    }

    // 인벤토리 전체 슬롯 수 (예제에서는 30 슬롯)
    const INVENTORY_SLOT_COUNT = 25;
    const updatePromises = [];

    // 0번 슬롯부터 INVENTORY_SLOT_COUNT - 1까지 순회하며 업데이트 진행
    for (let slotIdx = 0; slotIdx < INVENTORY_SLOT_COUNT; slotIdx++) {
      let slotData;
      if (Object.prototype.hasOwnProperty.call(inventoryData, slotIdx)) {
        try {
          slotData = JSON.parse(inventoryData[slotIdx]);
          // 파싱 결과가 null일 경우 기본값 처리
          if (slotData === null) {
            slotData = { itemId: null, stack: 0 };
          }
        } catch (parseError) {
          console.error(`슬롯 ${slotIdx} 데이터 파싱 실패: ${parseError}`);
          slotData = { itemId: null, stack: 0 };
        }
      } else {
        // Redis에 해당 슬롯 키가 없으면 기본값 지정
        slotData = { itemId: null, stack: 0 };
      }
      const { itemId, stack } = slotData;
      updatePromises.push(
        pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_INVENTORY, [
          itemId,
          stack,
          inventoryId,
          slotIdx,
        ]),
      );
    }

    // 모든 슬롯에 대한 업데이트 쿼리를 병렬로 실행
    await Promise.all(updatePromises);

    console.log(
      `${chalk.green('[DB Log]')} 플레이어 ${playerId}의 인벤토리가 성공적으로 업데이트되었습니다.`,
    );
  } catch (error) {
    console.error(`${chalk.red('[DB Error]')} updateInventory 오류: ${error}`);
    throw error;
  }
};

// Sector 이동할 때, 클라이언트 종료할 때 인벤토리 MySQL에 저장
export const syncInventoryToRedisAndSend = async (playerId) => {
  try {
    // MySQL에서 플레이어 인벤토리 전체 데이터를 슬롯 순서대로 조회
    const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.SEARCH_ALL_INVENTORY, [
      playerId,
    ]);

    if (!rows || rows.length === 0) {
      console.log(
        `${chalk.green('[DB Log]')} 플레이어 ${playerId}의 MySQL 인벤토리가 비어 있습니다.`,
      );
      return;
    }

    // Redis에 사용할 키를 생성하고 기존 데이터를 삭제
    const redisKey = `inventory:${playerId}`;
    await redisClient.del(redisKey);

    // MySQL에서 가져온 각 슬롯 데이터를 Redis 해시에 저장
    for (const row of rows) {
      // row: { inventory_id, player_id, item_id, slot_idx, stack, created_at, ... }
      await redisClient.hset(
        redisKey,
        row.slot_idx.toString(),
        JSON.stringify({
          itemId: row.item_id,
          stack: row.stack,
        }),
      );
    }
  } catch (error) {
    console.error(`${chalk.red('[DB Error]')} syncInventoryToRedisAndSend 오류: ${error}`);
    throw error;
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

// 경험치 획득 시 경험치 업데이트
export const updatePlayerExp = async (exp, playerId) => {
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_STAT_EXP, [exp, playerId]);
};

// 레벨업 시 레벨, 경험치, AP 업데이트
export const updatePlayerLevel = async (level, exp, abilityPoint, playerId) => {
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_STAT_LEVEL, [
    level,
    exp,
    abilityPoint,
    playerId,
  ]);
};

// AP 선택 시 능력치 업데이트
export const updatePlayerStat = async (stamina, pickSpeed, moveSpeed, abilityPoint, playerId) => {
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_STAT, [
    stamina,
    pickSpeed,
    moveSpeed,
    abilityPoint,
    playerId,
  ]);
};
