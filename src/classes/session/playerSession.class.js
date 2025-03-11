import chalk from 'chalk';
import redisClient from '../../utils/redis/redis.config.js';
import Player from '../player.class.js';
import { getSectorSessions, getPartySessions } from '../../session/sessions.js';
import { leavePartyHandler } from '../../handlers/social/party/leaveParty.handler.js';
import PACKET from '../../utils/packet/packet.js';

class PlayerSession {
  players = new Map();
  playerIdx = 1;

  async addPlayer(socket, user, nickname, classCode, statData) {
    const newPlayer = new Player(user, this.playerIdx++, nickname, classCode, statData);
    this.players.set(socket, newPlayer);

    // @@@ getSector가 sectorId로 탐색해서 수정 @@@
    getSectorSessions().getSector(100).setPlayer(socket, newPlayer);

    return newPlayer;
  }

  removePlayer(socket) {
    const SectorSessionManager = getSectorSessions();
    const partySessionManager = getPartySessions();

    // 2. playerSession에서 해당 소켓에 대한 플레이어 세션 삭제
    const player = this.getPlayer(socket);
    if (player) {
      const playerSectorId = player.getSectorId();
      const sector = SectorSessionManager.getSector(playerSectorId);
      sector.deletePlayer(player.user.socket);

      const oldTraps = sector.removeTraps(player.id);
      if (oldTraps) {
        sector.notifyExceptMe(PACKET.S2CRemoveTrap(oldTraps), player.id);
      }

      const partyId = player.getPartyId();
      if (partyId) {
        const party = partySessionManager.getParty(partyId);
        leavePartyHandler(socket, { partyId, leftPlayerId: player.id });
      }
      // 디스폰
      sector.notify(PACKET.S2CDespawn(player.id));

      this.players.delete(socket);

      console.log(chalk.green(`[onEnd] playerSession에서 삭제된 socket ID: ${socket.id}`));
    } else {
      console.log(
        chalk.yellow(`[onEnd] playerSession에서 찾을 수 없습니다. socket ID : ${socket.id}`),
      );
    }
  }

  getPlayer(socket) {
    return this.players.get(socket);
  }

  getPlayerById(playerId) {
    for (const player of this.players.values()) {
      if (player.id === playerId) return player;
    }
    return -1;
  }

  getSocketByPlayerId(playerId) {
    for (const [socket, player] of this.players.entries()) {
      if (player.id === playerId) {
        return socket; // 해당 소켓 반환
      }
    }
    console.log(
      chalk.yellow(
        `[getSocketByPlayerId] 해당 플레이어 ID(${playerId})에 대한 소켓을 찾을 수 없습니다.`,
      ),
    );
    return undefined; // 없으면 undefined 반환
  }

  getAllPlayers() {
    // return this.players.values();
    return this.players;
  }

  getPlayerByNickname(nickname) {
    for (const player of this.players.values()) {
      if (player.nickname === nickname) {
        return player;
      }
    }
    return -1;
  }

  getSocketByNickname(nickname) {
    for (const [socket, player] of this.players.entries()) {
      if (player.nickname === nickname) {
        return socket;
      }
    }
    console.log(chalk.yellow(`[getSocketByNickname] ${nickname}의 소켓을 찾을 수 없습니다.`));
    return undefined;
  }

  clearSession() {
    this.players.clear();
  }

  notify(packet) {
    for (const socket of this.players.keys()) {
      socket.write(packet);
    }
  }

  notifyExceptMe(packet, mySocketId) {
    for (const socket of this.players.keys()) {
      if (socket.id === mySocketId) continue;
      socket.write(packet);
    }
  }
}

export default PlayerSession;
