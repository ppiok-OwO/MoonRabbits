const createCharacterHandler = (socket, packetData) =>{
  console.log(`C_CreateCharacter 패킷 무사 도착 : ${packetData.nickname},${packetData.class}`);
}

export default createCharacterHandler;