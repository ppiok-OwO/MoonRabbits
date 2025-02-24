import { v4 as uuidV4 } from 'uuid';
import sector from '../sector.class.js';
import { config } from '../../config/config.js';

// class TestSectorSession {
//   sector = new Map();
//   players = new Map();
//   sceneCode = 2;

//   addPlayer(socket, player) {
//     this.players.set(socket, player);
//   }

//   removePlayer(socket) {
//     this.players.delete(socket);
//   }

//   getPlayer(socket) {
//     return this.players.get(socket);
//   }

//   getAllPlayer(sceneCode) {
//     const samePlayers = [];
//     console.log('---------플레이어 엔트리 시작');
//     console.log(this.players.entries());
//     console.log('---------플레이어 엔트리 ㄲ<ㅌ');
//     for (const [socket, player] of this.players.entries()) {
//       if (player.sceneCode === sceneCode) {
//         samePlayers.push(player);
//       }
//     }

//     return samePlayers;
//   }

//   notify(sceneCode, packet) {
//     if (this.players.size === 0) return;
//     for (const [socket, player] of this.players.entries()) {
//       if (player.currentScene === sceneCode) {
//         socket.write(packet);
//       }
//     }
//   }

//   setSector(sectorCode) {
//     const sectorId = uuidV4();
//     const newSector = new sector(sectorId, sectorCode);
//     this.sector.set(sectorId, newSector);
//     return newSector;
//   }

//   removeSector(sectorId) {
//     this.sector[sectorId].players.forEach((player) =>
//       player.secSectionId(config.sector.town),
//     );
//     this.sector.delete(sectorId);
//   }

//   getSector(sectorId) {
//     return this.sector.get(sectorId);
//   }

//   getAllSectors() {
//     return this.sector.values();
//   }

//   clearSession() {
//     this.sector.clear();
//   }
// }

//export default TestSectorSession;
