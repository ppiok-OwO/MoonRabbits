import { enterDungeonResponseHandler } from '../dungeon/response/enterDungeonResponse.handler.js';

export const enterDungeonHandler = (socket, packetData) => {
  const { dungeonCode } = packetData;
  enterDungeonResponseHandler(socket, dungeonCode + 5000);
};
