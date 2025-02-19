import { loadProtos } from '../init/loadProtos.js';
import delay from '../utils/delay.js';
import { Client } from './client.js';

let idNumber = 1;

function getIdNumber() {
  return idNumber++;
}

/////////////////////////////// 테스트 로직 //////////////////////////////////////////////
await loadProtos().then(gameTest);

async function gameTest() {
  const client = new Client();
  await delay(1000);
  // client.register('test@gmail.com', '1234', '1234');
  // 테스트 계정
  client.login('test@gmail.com', '1234');
  await delay(1000);
  client.enter('텟닉', 1001);v
}

// 다중 클라이언트 테스트
// async function gameTest() {
//   const client_count = 10;
//   const testTime = 10000;

//   const clients = await Promise.all(
//     Array.from({ length: client_count }, async () => {
//       const client = new Client();
//       return client;
//     }),
//   );
//   await delay(2000);

//   await Promise.all(
//     clients.map((client) => client.enter(`test${idNumber++}`, 1001)),
//   );
//   await delay(2000);

//   // 0.1초마다
//   let time = testTime;
//   while (time) {
//     await Promise.all(clients.map((client) => client.move()));
//     await delay(100);
//     time -= 100;
//   }

//   await delay(1000);
//   console.log(`테스트 클라이언트 수 : ${client_count}`);
//   console.log(`테스트 시간 : ${testTime}`);
//   console.log('부하테스트 완료');
// }
