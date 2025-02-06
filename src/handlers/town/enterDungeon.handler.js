import { enterDungeonResponseHandler } from '../dungeon/response/enterDungeonResponse.handler.js';

export const playerResponseHandler = (socket, packetData) => {
  const { dungeonCode } = packetData;
  enterDungeonResponseHandler(socket, dungeonCode);
};
