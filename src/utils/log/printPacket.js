const printPacket = (packetSize, packetId, packetData, str_in_out = '') => {
  if ((str_in_out === 'in')) console.log('---------- received Packet ----------');
  else if ((str_in_out === 'out'))
    console.log('---------- sent Packet ----------');
  else console.log('---------- Packet ----------')
  console.log('-Header');
  console.log(`    packetSize : ${packetSize}`);
  console.log(`    packetId : ${packetId}`);
  console.log();
  console.log('-PacketData');
  printObject(packetData);
  //console.log(`${Object.entries(packetData).reduce((packetData, data) => packetData + `    ${data[0]} : ${data[1]}\n`, '')}`);
  console.log('---------------------------------');
};

const printObject = (object, width = 4, isArray=false) => {
  const objectKeyValues = Object.entries(object);
  objectKeyValues.forEach(([key, value], index) => {
      if (typeof value === "object") {
          if (Array.isArray(value)) {
              console.log(" ".repeat(width) + `${key} [`);
              printObject(value, width + 2, true);
              console.log(" ".repeat(width) + "]");
          } else {
              if(isArray) console.log(" ".repeat(width) + `{`);
              else console.log(" ".repeat(width) + `${key} {`);
              printObject(value, width + 2);
              console.log(" ".repeat(width) + "}");
          }
      } else {
          if(isArray) console.log(" ".repeat(width) + `${value}${index < objectKeyValues.length - 1 ? "," : ""}`);
          else console.log(" ".repeat(width) + `${key} : ${value}${index < objectKeyValues.length - 1 ? "," : ""}`);
      }
  });
};

export default printPacket;