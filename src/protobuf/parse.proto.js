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
  C2S_REGISTER=0;
  S2C_REGISTER=1;
  C2S_LOGIN=2;
  S2C_LOGIN=3;
  C2S_CREATE_CHARACTER=4;
  S2C_CREATE_CHARACTER=5;

  C2S_ENTER=10;
  S2C_ENTER=11;
  C2S_LEAVE=12;
  S2C_LEAVE=13;

  C2S_ANIMATION=14;
  S2C_ANIMATION=15;

  C2S_CHAT=20;
  S2C_CHAT=21;

  S2C_SPAWN=22;
  S2C_DESPAWN=23;

  C2S_PLAYER_MOVE=30;
  S2C_PLAYER_MOVE=31;
  C2S_PLAYER_LOCATION=32;
  S2C_PLAYER_LOCATION=33;
  C2S_PLAYER_RUNNING=34;
  S2C_PLAYER_RUNNING=35;

  C2S_RANKING_LIST=50;
  S2C_UPDATE_RANKING=51;

  C2S_COLLISION=60;
  S2C_COLLISION=61;

  C2S_ITEM_OBTAINED = 80;
  C2S_ITEM_DISASSEMBLY = 81;
  C2S_ITEM_DESTROY = 82;
  C2S_INVENTORY_SORT = 83;
  S2C_INVENTORY_UPDATE = 84;

  C2S_CREATE_PARTY=100;
  S2C_CREATE_PARTY=101;
  C2S_INVITE_PARTY=102;
  S2C_INVITE_PARTY=103;
  C2S_JOIN_PARTY=104;
  S2C_JOIN_PARTY=105;
  C2S_LEAVE_PARTY=106;
  S2C_LEAVE_PARTY=107;
  C2S_CHECK_PARTY_LIST=108;
  S2C_CHECK_PARTY_LIST=109;
  C2S_KICK_OUT_MEMBER=110;
  S2C_KICK_OUT_MEMBER=111;
  C2S_DISBAND_PARTY=112;
  S2C_DISBAND_PARTY=113;
  C2S_ALLOW_INVITE=114;
  S2C_ALLOW_INVITE=115;
  C2S_REJECT_INVITE=116;
  S2C_REJECT_INVITE=117;

  C2S_MONSTER_LOCATION=120;
  S2C_MONSTER_LOCATION=121;
  C2S_DETECTED_PLAYER=122;
  S2C_DETECTED_PLAYER=123;
  C2S_MISSING_PLAYER=124;
  S2C_MISSING_PLAYER=125;

  S2C_RESOURCE_LIST=141;
  S2C_UPDATE_DURABILITY=142;
  C2S_GATHERING_START=143;
  S2C_GATHERING_START=144;
  C2S_GATHERING_SKILL_CHECK=145;
  S2C_GATHERING_SKILL_CHECK=146;
  S2C_GATHERING_DONE=147;

  C2S_SECTOR_ENTER=170;
  S2C_SECTOR_ENTER=171;
  C2S_SECTOR_LEAVE=172;
  S2C_SECTOR_LEAVE=173;
  C2S_IN_PORTAL=174;
  S2C_IN_PORTAL=175;

  C2S_ADD_EXP=200;
  S2C_ADD_EXP=201;
  S2C_LEVEL_UP=202;
  C2S_INVEST_POINT=203;
  S2C_INVEST_POINT=204;
`;
const MESSAGES = `
message C2SRegister{
  string email = 1;
  string pw = 2;
  string pwCheck = 3;
}
message S2CRegister{
  bool isSuccess = 1;
  string msg = 2;
}
message C2SLogin{
  string email = 1;
  string pw = 2;
}
message S2CLogin{
  bool isSuccess = 1;
  string msg = 2;
  repeated OwnedCharacter ownedCharacters = 3;
}
message C2SCreateCharacter{
  string nickname = 1;
  int32 classCode = 2;
}
message S2CCreateCharacter{
  bool isSuccess = 1;
  string msg = 2;
}

message C2SEnter{
  string nickname = 1;
  int32 classCode = 2;
  int32 targetScene = 3;
}
message S2CEnter{
  PlayerInfo player = 1;
}
message C2SLeave{
  optional int32  targetScene = 1;
}
message S2CLeave{}

message C2SAnimation{
  int32 animCode = 1;
}
message S2CAnimation{
  int32 playerId = 1;
  int32 animCode = 2;
}

message C2SChat{
  int32 playerId = 1;
  string senderName = 2;
  string chatMsg = 3;
  string chatType = 4;
}

message S2CChat{
  int32 playerId = 1;
  string chatMsg = 2;
  string chatType = 3;
}

message S2CSpawn{
  repeated PlayerInfo players = 1;
}
message S2CDespawn{
  repeated int32 playerIds = 1;
  int32 currentScene = 2;
}

message C2SPlayerMove{
  float startPosX = 1;
  float startPosY = 2;
  float startPosZ = 3;
  float targetPosX = 4;
  float targetPosY = 5;
  float targetPosZ = 6;
}
message S2CPlayerMove{}
message C2SPlayerLocation{
  TransformInfo transform = 1;
}
message S2CPlayerLocation{
  int32 playerId = 1;
  TransformInfo transform = 2;
  bool isValidTransform = 3;
  int32 currentScene = 4;

}
message C2SPlayerRunning{} 
message S2CPlayerRunning{} 

message C2SRankingList{
  string type = 1;
}
message S2CUpdateRanking{
  string status = 1;
  RankingList data = 2;
}

message C2SCollision{
  CollisionInfo collisionInfo = 2;
}
message S2CCollision{
  CollisionPushInfo collisionPushInfo = 2;
}
message C2SItemObtained {
  int32 slotIdx = 1;
  int32 itemId = 2;
}
message C2SItemDisassembly {
  int32 slotIdx = 1;
  int32 itemId = 2;
}
message C2SItemDestroy {
  int32 slotIdx = 1;
  int32 itemId = 2;
}
message C2SInventorySort {
  repeated InventorySlot slots = 1;
}
message S2CInventoryUpdate {
  repeated InventorySlot slots = 1;
}
message C2SCreateParty{}
message S2CCreateParty{
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
  repeated MemberCardInfo members = 4;
}
message C2SInviteParty{
  string partyId = 1;
  string nickname = 2;
}
message S2CInviteParty{
  string leaderNickname = 1;
  string partyId = 2;
  int32 memberId = 3;
}
message C2SJoinParty{
  string partyId = 1;
  int32 memberId = 2;
}
message S2CJoinParty{
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
  repeated MemberCardInfo members = 4;
}
message C2SLeaveParty{
  string partyId = 1;
  int32 leftPlayerId = 2;
}
message S2CLeaveParty{
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
  repeated MemberCardInfo members = 4;
}
message C2SCheckPartyList {
}
message S2CCheckPartyList {
  repeated PartyInfo partyInfos = 1;
  int32 memberId = 2;
}
message C2SKickOutMember{
  string partyId = 1;
  int32 memberId = 2;
}
message S2CKickOutMember{
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
  repeated MemberCardInfo members = 4;
}
message C2SDisbandParty{
  string partyId = 1;
}
message S2CDisbandParty{
  string msg = 1;
}
message C2SAllowInvite{
  string partyId = 1;
  int32 memberId = 2;
}
message S2CAllowInvite{
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
  repeated MemberCardInfo members = 4;
}
message C2SRejectInvite {
  int32 memberId = 1;
}

message S2CRejectInvite {
}

message C2SMonsterLocation{
  int32 monsterId = 1;
  TransformInfo transformInfo = 2;
}
message S2CMonsterLocation{
  int32 monsterId = 1;
  TransformInfo transformInfo = 2;
}
message C2SDetectedPlayer{
  int32 monsterId = 1;
  int32 playerId = 2;
}
message S2CDetectedPlayer{
  int32 monsterId = 1;
  int32 playerId = 2;
}
message C2SMissingPlayer{
  int32 monsterId = 1;
  int32 playerId = 2;
}
message S2CMissingPlayer{
  int32 monsterId = 1;
  int32 playerId = 2;
}

message S2CResourcesList{
  repeated Resource resources = 1;
}
message S2CUpdateDurability{
  int32 placedId = 1;
  int32 durability = 2;
}
message C2SGatheringStart{
  int32 placedId = 1;
}
message S2CGatheringStart{
  int32 placedId = 1;
  int32 angle = 2;
  int32 difficulty = 3;
}
message C2SGatheringSkillCheck{
  int32 placedId = 1;
  int32 deltaTime = 2;
}
message S2CGatheringSkillCheck{
  int32 placedId = 1;
  int32 durability = 2;
}
message S2CGatheringDone{
  int32 placedId = 1;
  int32 itemId = 2;
  int32 quantity = 3;
}

message C2SSectorEnter{
  int32 sectorId = 1;
  optional string partyId = 2;
}
message S2CSectorEnter{
  SectorInfo sectorInfo = 1;
  PlayerStatus player = 2;
}
message C2SSectorLeave{
  int32 sectorId = 1;
  optional string partyId = 2;
}
message S2CSectorLeave{}
message C2SInPortal{
  int32 sectorId = 1;
  int32 portalId = 2;
}
message S2CInPortal{}

message C2SAddExp {
  int32 count = 1;
} 
message S2CAddExp {
  int32 updatedExp = 1;
} 
message S2CLevelUp {
  int32 playerId = 1;
  int32 updatedLevel = 2;
  int32 newTargetExp = 3;
  int32 updatedExp = 4;
  int32 abilityPoint = 5;
} 
message C2SInvestPoint {
  int32 statCode = 1;
}
message S2CInvestPoint {
  StatInfo statInfo = 1;
}
`;
const STRUCTS = `
message PlayerInfo {
  int32 playerId = 1;  
  string nickname = 2;  
  int32 level = 3;
  int32 classCode = 4; 
  TransformInfo transform = 5;
  StatInfo statInfo = 6;
  int32 currentScene = 7;
}

message PlayerRank {
  int32 rank = 1;
  string playerId = 2;
  string nickname = 3;
  int32 exp = 4;
}

message RankingList {
  repeated PlayerRank rankingList = 1;
  string timestamp = 2;
} 

message TransformInfo {
  float posX = 1;
  float posY = 2;
  float posZ = 3;
  float rot = 4; 
}

message SectorInfo {
  int32 sectorId = 1;
  repeated MonsterStatus monsters = 2;
}

message PlayerStatus {
  int32 playerLevel = 1;
  string playerName = 2;
  int32 playerStamina = 3;
  int32 playerPickSpeed = 4;
  int32 playerMoveSpeed = 5;
  int32 abilityPoint = 6;
}
message ItemInfo {
  int32 itemId = 1;
  int32 stack = 2;
}

message InventoryInfo {}

message MemberCardInfo {
  int32 id = 1;
  string nickname = 2;
  bool isLeader = 3;
  bool isMine = 4;
}

message OwnedCharacter {
  string nickname = 1;
  int32 classCode = 2;
}

message CollisionInfo {
  int32 sectorCode = 1;
  int32 myType = 2;
  int32 myId = 3;
  Vec3 myPosition = 4;
  float myRadius = 5;
  float myHeight = 6;
  int32 targetType = 7;
  int32 targetId = 8;
  Vec3 targetPosition = 9;
  float targetRadius = 10;
  float targetHeight = 11;
}

message CollisionPushInfo {
  bool hasCollision = 1;
  int32 sectorCode = 2;
  int32 myType = 3;
  int32 myId = 4;
  int32 targetType = 5;
  int32 targetId = 6;
  Vec3 pushDirection = 7;
  float pushDistance = 8;
}

message Vec3 {
  float x = 1;
  float y = 2;
  float z = 3;
}

message Resource {
  int32 resourceIdx = 1;
  int32 resourceId = 2;
}

message StatInfo {
  int32 level = 1;
  int32 stamina = 2;
  int32 pickSpeed = 3;
  int32 moveSpeed = 4;
  int32 abilityPoint = 5;
}

message MonsterStatus {
  int32 monsterId = 1;
  int32 monsterModel = 2;
  string monsterName = 3;
  float monsterMoveSpeed = 4; 
}
message PartyInfo {
  string partyId = 1;
  int32 leaderId = 2;
  int32 memberCount = 3;
}
message InventorySlot {
  int32 slotIdx = 1;
  int32 itemId = 2;
  int32 stack = 3;
}
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
