import { getPlayerSession } from "../../session/sessions.js";
import Packet from "../../utils/packet/packet.js";
import playerSpawnNotificationHandler from "../town/playerSpawnNotification.handler.js"

const leaveHandler = (socket, packetData) => {
  const player = getPlayerSession().getPlayer(socket);

    console.log("leave핸들러 도착 : ")

  socket.write(Packet.S2CPlayerDespawn([player.id],player.getCurrentScene()));
  // 파티가 있는지 체크
  // 파티가 있다면 파티원 전부의ㅏ playerId들을 가져와서 배열에 담는다
  // 디스폰 시켜야하고
  // 만약 어디로 갈 거라면 어디로 갈지 보내줘야하는데
  // 패킷에 추가를 안해놨네 써글
  // Leave에 targetScene 필요함 optional로
  const targetScene = packetData.targetScene || 2;
  
  player.setCurrentScene(targetScene);
  
  socket.write(Packet.S2CEnter(player.getPlayerInfo()));
  playerSpawnNotificationHandler(socket, packetData);
};

export default leaveHandler