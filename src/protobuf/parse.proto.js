import fs from 'fs';

/* 사용법 */
// [1] MSG_IDS 변수에 proto 파일의 enum MsgId {} 에서 중괄호 내부 내용들 전체를 백틱으로 감싸 할당
// [2] PACKETS 변수에 message PacketName {}들 전체를 복사해 백틱으로 감싸 할당
// [3] STRUCTS 변수에 마찬가지로 message StructName {}들 전체를 복사해 백틱으로 감싸 할당
// [4] 하단에 주석 처리된 toJson 실행부 중 필요한 데이터들 주석 해제
// [5] 터미널에 node src/protobuf/parse.proto.js 또는 npm run parse
// [6] 생성된 Json 파일 전체 복사 후 갱신할 변수에 할당
// [7] 프리티어 적용 시 key들의 따옴표는 사라짐, value의 경우 모두 바꾸기 기능 통해 제거
// [8] 행복 프로토 생활 시작...

const MSG_IDS = `
`;
const MESSAGES = `
`;
const STRUCTS = `
`;

/* toJson 실행부 */
toJson('packet.ids.json', getPacketIds(MSG_IDS)); // src/packet/packet.id.js에 적용
toJson('packet.names.json', getPacketNames(MSG_IDS)); // src/protobuf/packetNames.js에 적용
toJson('payload.funcs.json', getDataFuncs(MESSAGES)); // src/packet/payload.js에 적용
toJson('struct.funcs.json', getDataFuncs(STRUCTS)); // src/packet/struct.data.js에 적용
toJson('packet.funcs.json', getPacketFuncs(MESSAGES)); // src/packet/packet.js에 적용

/* 주의 사항 */
// getPacketFuncs() 함수는 슬프게도 payload가 없는 패킷이 누락됩니당
// C2S는 상관없으나, S2C인데 payload가 없는 패킷이라면 수작업으로 추가시켜 주어야 합니다!

/* 궁금하면 보십시오 */
function getPacketIds(MsgIds) {
  const packetIds = {};

  MsgIds.split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes('='))
    .forEach((line) => {
      const [key, value] = line.split('=');
      const trimmedKey = key.trim();
      const trimmedValue = Number(value.replace(';', '').trim());

      const match = trimmedKey.match(/^(C2S|S2C)_(.+)$/);
      if (match) {
        const prefix = match[1];
        const rest = match[2]
          .toLowerCase()
          .replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase());

        packetIds[prefix + rest] = trimmedValue;
      }
    });

  return packetIds;
}
function getPacketNames(MsgIds) {
  return MsgIds.split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.includes('='))
    .map((line) => {
      const [key] = line.split('=');
      const trimmedKey = key.trim();

      const match = trimmedKey.match(/^(C2S|S2C)_(.+)$/);
      if (match) {
        const prefix = match[1];
        const rest = match[2]
          .toLowerCase()
          .replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase());

        return prefix + rest;
      }
      return null;
    })
    .filter(Boolean);
}
function getDataFuncs(Messages) {
  const messages = {};
  const regex = /message\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = regex.exec(Messages)) !== null) {
    const messageName = match[1];
    console.log(messageName);
    if (messageName.slice(0, 2) == 'C2') continue;
    const fieldsStr = match[2].trim();

    const fields = fieldsStr
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'))
      .map((line) => {
        const parts = line.split(/\s+/);

        let modifier = '';
        let type = '';
        let name = '';

        if (parts[0] === 'optional' || parts[0] === 'repeated') {
          modifier = parts[0];
          type = parts[1];
          name = parts[2].split('=')[0].trim();
        } else {
          type = parts[0];
          name = parts[1].split('=')[0].trim();
        }

        if (modifier) {
          type = `${type}_${modifier}`;
        }

        return { type, name };
      });

    const paramList = fields.map((f) => `${f.name}_${f.type}`).join(', ');
    const returnObj = fields
      .map((f) => `${f.name}: ${f.name}_${f.type}`)
      .join(', ');

    const funcStr = `(${paramList}) => { return { ${returnObj} }; }`;

    messages[messageName] = funcStr;
  }

  return messages;
}
function getPacketFuncs(Messages) {
  const messages = {};
  const regex = /message\s+(\w+)\s*\{([^}]+)\}/g;
  let match;

  while ((match = regex.exec(Messages)) !== null) {
    const messageName = match[1];
    console.log(messageName);
    if (messageName.slice(0, 2) == 'C2') continue;

    const fieldsStr = match[2].trim();

    const fields = fieldsStr
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'))
      .map((line) => {
        const parts = line.split(/\s+/);

        let modifier = '';
        let type = '';
        let name = '';

        if (parts[0] === 'optional' || parts[0] === 'repeated') {
          modifier = parts[0];
          type = parts[1];
          name = parts[2].split('=')[0].trim();
        } else {
          type = parts[0];
          name = parts[1].split('=')[0].trim();
        }

        if (modifier) {
          type = `${type}_${modifier}`;
        }

        return { type, name };
      });

    const paramList = fields.map((f) => `${f.name}_${f.type}`).join(', ');
    const returnObj = `makePacket(PACKET_ID.${messageName}, PAYLOAD.${messageName}(${paramList}))`;

    const funcStr = `(${paramList}) => { return ${returnObj} }`;

    messages[messageName] = funcStr;
  }

  return messages;
}

/* 객체 또는 배열 json 파일로 내보내는 함수 */
function toJson(filename, obj) {
  fs.writeFileSync(filename, JSON.stringify(obj, null, 2), 'utf8');
}
