import { packetIdEntries } from '../../config/config.js';
import { addPacketLog, addServerLog } from './log.js';

const printPacket = (packetSize, packetId, packetData, str_in_out = '') => {
  const packetType = packetIdEntries.find(([, id]) => id === packetId)[0];
  const color = str_in_out === 'in' ? 33 : 36;

  console.log(`\x1b[${color}m[${packetType} 패킷]\x1b[0m`);
  printObject(packetData);
  console.log();

  addPacketLog(packetType, JSON.stringify(packetData));
};

const printObject = (object, width = 2, isArray = false) => {
  const objectKeyValues = Object.entries(object);
  objectKeyValues.forEach(([key, value], index) => {
    if (typeof value === 'number' && !Number.isInteger(value))
      value = value.toFixed(1);
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        console.log(' '.repeat(width) + `${key} [`);
        printObject(value, width + 2, true);
        console.log(' '.repeat(width) + ']');
      } else {
        if (isArray) console.log(' '.repeat(width) + `{`);
        else console.log(' '.repeat(width) + `${key} {`);
        printObject(value, width + 2);
        console.log(' '.repeat(width) + '}');
      }
    } else {
      if (isArray)
        console.log(
          ' '.repeat(width) +
            `${value}${index < objectKeyValues.length - 1 ? ',' : ''}`,
        );
      else
        console.log(
          ' '.repeat(width) +
            `${key} : ${value}${index < objectKeyValues.length - 1 ? ',' : ''}`,
        );
    }
  });
};

export default printPacket;
