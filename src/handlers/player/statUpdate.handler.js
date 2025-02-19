export const statUpdateHandler = (socket, payload) => {
  const { statCode, point } = payload;

  const playerSession = getPlayerSession();
  const player = playerSession.getPlayer(socket);

  player.addStat(statCode, point);
  console.log(`${player.nickname}의 능력치(${statCode}) ${point}만큼 증가 (스탯 미구현)`);
};
