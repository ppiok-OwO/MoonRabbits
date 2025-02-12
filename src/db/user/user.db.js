import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email) => {
  const [rows] = await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  if (rows.length > 0) {
    console.log('사용자를 찾았습니다 : ', rows[0]); // 여기서 user_id 값을 확인
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

export const createUser = async (email, password) => {
  const userId = uuidv4(); // UUID 생성
  const hashedPassword = await bcrypt.hash(password, 10);

  // 사용자 생성 쿼리 실행
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.CREATE_USER, [userId, email, hashedPassword]);

  return { userId, email }; // 새로 생성된 사용자 정보 반환
};

export const updateUserLogin = async (id) => {
  await pools.PROJECT_R_USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};
