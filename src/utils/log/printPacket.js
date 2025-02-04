const printPacket = (packetSize, packetId, packetData, str_in_out = '') => {
  if ((str_in_out = 'in')) console.log('---------- received Packet ----------');
  else if ((str_in_out = 'out'))
    console.log('---------- sent Packet ----------');
  else console.log('---------- Packet ----------')
  console.log('-Header');
  console.log(`    packetSize : ${packetSize}`);
  console.log(`    packetId : ${packetId}`);
  console.log();
  console.log('-PacketData');
  console.log(`${Object.entries(packetData).reduce((packetData, data) => packetData + `    ${data[0]} : ${data[1]}\n`, '')}`);
};

export default printPacket;