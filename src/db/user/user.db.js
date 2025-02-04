import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_ID, [
    deviceId,
  ]); // mysql2 모듈의 Prepared Statements 기능
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = deviceId;
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id]); // mysql2 모듈의 Prepared Statements 기능
  return { id };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};