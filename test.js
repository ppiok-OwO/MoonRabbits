import redisClient from './src/utils/redis/redis.config.js';
import PAYLOAD_DATA from "./src/utils/packet/payloadData.js";

const player_id = 'dbe8302e-3cdd-4afc-9feb-f8cdb1c3bde6';
const redisKey = `inventory:${player_id}`;
const itemIds = [22001];
const slots = [];
const redisSlots = {};
      
try {
  const data = (await redisClient.hgetall(redisKey)) || {};
  Object.assign(redisSlots, data);
} catch (error) {
  console.error('redis inventory 조회 에러');
}

for (const id of itemIds) {
  for (let i = 0; i < 25; i++) {
    if (JSON.parse(redisSlots[i]).itemId*1 === id) {
        console.log(redisSlots[i]);
      slots.push(PAYLOAD_DATA.InventorySlot(i, id, JSON.parse(redisSlots[i]).stack));
      break;
    }
  }
}

console.log(slots);

// 인벤토리 전체 조회
// const inventoryKey = `inventory:*`;
// let cursor = '0';
// const results = {};
// do {
//     const [newCursor, keys] = await redisClient.scan(cursor, 'MATCH', inventoryKey, 'COUNT', 100);
//     cursor = newCursor;

//     for(const key of keys){
//         const value = await redisClient.hgetall(key);
//         results[key] = value;
//     }
// } while (cursor !== '0');

// console.log(results);
