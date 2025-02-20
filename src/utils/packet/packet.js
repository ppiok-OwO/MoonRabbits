import makePacket from './makePacket.js';
import PACKET_ID from './packet.id.js';
import PAYLOAD from './payload.js';

const PACKET = {
  S2CRegister: (isSuccess_bool, msg_string) => {
    return makePacket(
      PACKET_ID.S2CRegister,
      PAYLOAD.S2CRegister(isSuccess_bool, msg_string),
    );
  },
  S2CLogin: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_OwnedCharacter_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CLogin,
      PAYLOAD.S2CLogin(
        isSuccess_bool,
        msg_string,
        ownedCharacters_OwnedCharacter_repeated,
      ),
    );
  },
  S2CCreateCharacter: (isSuccess_bool, msg_string) => {
    return makePacket(
      PACKET_ID.S2CCreateCharacter,
      PAYLOAD.S2CCreateCharacter(isSuccess_bool, msg_string),
    );
  },
  S2CEnter: (player_PlayerInfo) => {
    return makePacket(PACKET_ID.S2CEnter, PAYLOAD.S2CEnter(player_PlayerInfo));
  },
  S2CAnimation: (playerId_int32, animCode_int32) => {
    return makePacket(
      PACKET_ID.S2CAnimation,
      PAYLOAD.S2CAnimation(playerId_int32, animCode_int32),
    );
  },
  S2CChat: (playerId_int32, chatMsg_string) => {
    return makePacket(
      PACKET_ID.S2CChat,
      PAYLOAD.S2CChat(playerId_int32, chatMsg_string),
    );
  },
  S2CPlayerSpawn: (players_PlayerInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CPlayerSpawn,
      PAYLOAD.S2CPlayerSpawn(players_PlayerInfo_repeated),
    );
  },
  S2CPlayerDespawn: (playerIds_int32_repeated, currentScene_int32) => {
    return makePacket(
      PACKET_ID.S2CPlayerDespawn,
      PAYLOAD.S2CPlayerDespawn(playerIds_int32_repeated, currentScene_int32),
    );
  },
  S2CPlayerLocation: (
    playerId_int32,
    transform_TransformInfo,
    isValidTransform_bool,
    currentScene_int32,
  ) => {
    return makePacket(
      PACKET_ID.S2CPlayerLocation,
      PAYLOAD.S2CPlayerLocation(
        playerId_int32,
        transform_TransformInfo,
        isValidTransform_bool,
        currentScene_int32,
      ),
    );
  },
  S2CUpdateRanking: (status_string, data_RankingList) => {
    return makePacket(
      PACKET_ID.S2CUpdateRanking,
      PAYLOAD.S2CUpdateRanking(status_string, data_RankingList),
    );
  },
  S2CPlayerCollision: (playerId_int32, collisionPushInfo_CollisionPushInfo) => {
    return makePacket(
      PACKET_ID.S2CPlayerCollision,
      PAYLOAD.S2CPlayerCollision(
        playerId_int32,
        collisionPushInfo_CollisionPushInfo,
      ),
    );
  },
  S2CMonsterCollision: (
    monsterId_int32,
    collisionPushInfo_CollisionPushInfo,
  ) => {
    return makePacket(
      PACKET_ID.S2CMonsterCollision,
      PAYLOAD.S2CMonsterCollision(
        monsterId_int32,
        collisionPushInfo_CollisionPushInfo,
      ),
    );
  },
  S2CSelectStore: (storeInfo_StoreInfo, itemInfo_ItemInfo_repeated) => {
    return makePacket(
      PACKET_ID.S2CSelectStore,
      PAYLOAD.S2CSelectStore(storeInfo_StoreInfo, itemInfo_ItemInfo_repeated),
    );
  },
  S2CBuyItem: (success_string, inventoryInfo_InventoryInfo, gold_int32) => {
    return makePacket(
      PACKET_ID.S2CBuyItem,
      PAYLOAD.S2CBuyItem(
        success_string,
        inventoryInfo_InventoryInfo,
        gold_int32,
      ),
    );
  },
  S2CCreateParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CCreateParty,
      PAYLOAD.S2CCreateParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CInviteParty: (leaderNickname_string, partyId_string, memberId_int32) => {
    return makePacket(
      PACKET_ID.S2CInviteParty,
      PAYLOAD.S2CInviteParty(
        leaderNickname_string,
        partyId_string,
        memberId_int32,
      ),
    );
  },
  S2CJoinParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CJoinParty,
      PAYLOAD.S2CJoinParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CLeaveParty: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CLeaveParty,
      PAYLOAD.S2CLeaveParty(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CSetPartyLeader: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CSetPartyLeader,
      PAYLOAD.S2CSetPartyLeader(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CKickOutMember: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CKickOutMember,
      PAYLOAD.S2CKickOutMember(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CDisbandParty: (msg_string) => {
    return makePacket(
      PACKET_ID.S2CDisbandParty,
      PAYLOAD.S2CDisbandParty(msg_string),
    );
  },
  S2CAllowInvite: (
    partyId_string,
    leaderId_int32,
    memberCount_int32,
    members_MemberCardInfo_repeated,
  ) => {
    return makePacket(
      PACKET_ID.S2CAllowInvite,
      PAYLOAD.S2CAllowInvite(
        partyId_string,
        leaderId_int32,
        memberCount_int32,
        members_MemberCardInfo_repeated,
      ),
    );
  },
  S2CMonsterLocation: (monsterId_int32, transformInfo_TransformInfo) => {
    return makePacket(
      PACKET_ID.S2CMonsterLocation,
      PAYLOAD.S2CMonsterLocation(monsterId_int32, transformInfo_TransformInfo),
    );
  },
  S2CDetectedPlayer: (monsterId_int32, playerId_int32) => {
    return makePacket(
      PACKET_ID.S2CDetectedPlayer,
      PAYLOAD.S2CDetectedPlayer(monsterId_int32, playerId_int32),
    );
  },
  S2CMissingPlayer: (monsterId_int32, playerId_int32) => {
    return makePacket(
      PACKET_ID.S2CMissingPlayer,
      PAYLOAD.S2CMissingPlayer(monsterId_int32, playerId_int32),
    );
  },
  S2CResourceList: (resources_Resource_repeated) => {
    return makePacket(
      PACKET_ID.S2CResourceList,
      PAYLOAD.S2CResourceList(resources_Resource_repeated),
    );
  },
  S2CUpdateDurability: (placedId_int32, durability_int32) => {
    return makePacket(
      PACKET_ID.S2CUpdateDurability,
      PAYLOAD.S2CUpdateDurability(placedId_int32, durability_int32),
    );
  },
  S2CGatheringStart: (placedId_int32, angle_int32, difficulty_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringStart,
      PAYLOAD.S2CGatheringStart(placedId_int32, angle_int32, difficulty_int32),
    );
  },
  S2CGatheringSkillCheck: (placedId_int32, durability_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringSkillCheck,
      PAYLOAD.S2CGatheringSkillCheck(placedId_int32, durability_int32),
    );
  },
  S2CGatheringDone: (placedId_int32, itemId_int32, quantity_int32) => {
    return makePacket(
      PACKET_ID.S2CGatheringDone,
      PAYLOAD.S2CGatheringDone(placedId_int32, itemId_int32, quantity_int32),
    );
  },
  S2CSectorEnter: (sectorInfo_SectorInfo, player_PlayerStatus) => {
    return makePacket(
      PACKET_ID.S2CSectorEnter,
      PAYLOAD.S2CSectorEnter(sectorInfo_SectorInfo, player_PlayerStatus),
    );
  },
  S2CAddExp: (updatedExp_int32) => {
    return makePacket(PACKET_ID.S2CAddExp, PAYLOAD.S2CAddExp(updatedExp_int32));
  },
  S2CLevelUp: (
    playerId_int32,
    updatedLevel_int32,
    newTargetExp_int32,
    updatedExp_int32,
    abilityPoint_int32,
  ) => {
    return makePacket(
      PACKET_ID.S2CLevelUp,
      PAYLOAD.S2CLevelUp(
        playerId_int32,
        updatedLevel_int32,
        newTargetExp_int32,
        updatedExp_int32,
        abilityPoint_int32,
      ),
    );
  },
  S2CSelectAp: (statInfo_StatInfo) => {
    return makePacket(
      PACKET_ID.S2CSelectAp,
      PAYLOAD.S2CSelectAp(statInfo_StatInfo),
    );
  },
};

export default PACKET;

// import { config } from ../../config/config.js;
// import payload from ./payload.js;
// import payloadData from ./payloadData.js;

// const { packetId } = config;

// const Packet = {
//   //#region  /* 게임 시작 관련 */
//   C2SRegister: (email_string, pw_string, pwCheck_string) => {
//     return makePacket(
//       packetId.C2SRegister,
//       payload.C2SRegister(email_string, pw_string, pwCheck_string),
//     );
//   },
//   S2CRegister: (isSuccess_bool, msg_string) => {
//     return makePacket(
//       packetId.S2CRegister,
//       payload.S2CRegister(isSuccess_bool, msg_string),
//     );
//   },
//   C2SLogin: (email_string, pw_string) => {
//     return makePacket(
//       packetId.C2SLogin,
//       payload.C2SLogin(email_string, pw_string),
//     );
//   },
//   S2CLogin: (
//     isSuccess_bool,
//     msg_string,
//     ownedCharacters_ArrayOwnedCharacters,
//   ) => {
//     return makePacket(
//       packetId.S2CLogin,
//       payload.S2CLogin(
//         isSuccess_bool,
//         msg_string,
//         ownedCharacters_ArrayOwnedCharacters,
//       ),
//     );
//   },
//   C2SCreateCharacter: (nickname_string, classCode_int) => {
//     return makePacket(
//       packetId.C2SCreateCharacter,
//       payload.C2SCreateCharacter(nickname_string, classCode_int),
//     );
//   },
//   S2CCreateCharacter: (isSuccess_bool, msg_string) => {
//     return makePacket(
//       packetId.S2CCreateCharacter,
//       payload.S2CCreateCharacter(isSuccess_bool, msg_string),
//     );
//   },
//   /* 마을 관련 */
//   C2SEnter: (nickname_string, classCode_int,targetScene_int) => {
//     return makePacket(
//       packetId.C2SEnter,
//       payload.C2SEnter(nickname_string, classCode_int,targetScene_int),
//     );
//   },
//   S2CEnter: (player_PlayerInfo) => {
//     return makePacket(
//       packetId.S2CEnter,
//       payload.S2CEnter(player_PlayerInfo),
//     );
//   },
//   C2SLeave: () => {
//     return makePacket(packetId.C2SLeave);
//   },
//   S2CLeave: () => {
//     return makePacket(packetId.S2CLeave);
//   },
//   C2SAnimation: (animCode_int) => {
//     return makePacket(
//       packetId.C2SAnimation,
//       payload.C2SAnimation(animCode_int),
//     );
//   },
//   S2CAnimation: (playerId_int, animCode_int) => {
//     return makePacket(
//       packetId.S2CAnimation,
//       payload.S2CAnimation(playerId_int, animCode_int),
//     );
//   },
//   //#endregion
//   //#region  /* 공통 01 - 채팅, 소환 */
//   C2SChat: (playerId_int, senderName_string, chatMsg_string) => {
//     return makePacket(
//       packetId.C2SChat,
//       payload.C2SChat(playerId_int, senderName_string, chatMsg_string),
//     );
//   },
//   S2CChat: (playerId_int, chatMsg_string) => {
//     return makePacket(
//       packetId.S2CChat,
//       payload.S2CChat(playerId_int, chatMsg_string),
//     );
//   },
//   S2CPlayerSpawn: (players_ArrayOfPlayerInfo) => {
//     return makePacket(
//       packetId.S2CPlayerSpawn,
//       payload.S2CPlayerSpawn(players_ArrayOfPlayerInfo),
//     );
//   },
//   S2CPlayerDespawn: (playerIds_ArrayOfInt,currentScene_int) => {
//     return makePacket(
//       packetId.S2CPlayerDespawn,
//       payload.S2CPlayerDespawn(playerIds_ArrayOfInt,currentScene_int),
//     );
//   },
//   //#endregion
//   //#region  /* 공통 02 - 플레이어 이동 */
//   C2SPlayerMove: (
//     startPosX_float,
//     startPosY_float,
//     startPosZ_float,
//     targetPosX_float,
//     targetPosY_float,
//     targetPosZ_float,
//   ) => {
//     return makePacket(
//       packetId.C2SPlayerMove,
//       payload.C2SPlayerMove(
//         startPosX_float,
//         startPosY_float,
//         startPosZ_float,
//         targetPosX_float,
//         targetPosY_float,
//         targetPosZ_float,
//       ),
//     );
//   },
//   S2CPlayerMove: () => {
//     return makePacket(packetId.S2CPlayerMove);
//   },
//   C2SPlayerLocation: (transform_TransformInfo) => {
//     return makePacket(
//       packetId.C2SPlayerLocation,
//       payload.C2SPlayerLocation(transform_TransformInfo),
//     );
//   },
//   S2CPlayerLocation: (
//     playerId_int,
//     transform_TransformInfo,
//     isValidTransform_bool,
//     currentScene_int
//   ) => {
//     return makePacket(
//       packetId.S2CPlayerLocation,
//       payload.S2CPlayerLocation(
//         playerId_int,
//         transform_TransformInfo,
//         isValidTransform_bool,
//         currentScene_int,
//       ),
//     );
//   },
//   //#endregion
//   //#region /* 공통 03 - 충돌 관련 */
//   C2SPlayerCollision: (playerId_int, collisionInfo_CollisionInfo) => {
//     return makePacket(
//       packetId.C2SPlayerCollision,
//       payload.C2SPlayerCollision(playerId_int, collisionInfo_CollisionInfo),
//     );
//   },
//   S2CPlayerCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
//     return makePacket(
//       packetId.S2CPlayerCollision,
//       payload.S2CPlayerCollision(
//         playerId_int,
//         collisionPushInfo_CollisionPushInfo,
//       ),
//     );
//   },
//   C2SMonsterCollision: (playerId_int, collisionInfo_CollisionInfo) => {
//     return makePacket(
//       packetId.C2SMonsterCollision,
//       payload.C2SMonsterCollision(playerId_int, collisionInfo_CollisionInfo),
//     );
//   },
//   S2CMonsterCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
//     return makePacket(
//       packetId.S2CMonsterCollision,
//       S2CMonsterCollision(playerId_int, collisionPushInfo_CollisionPushInfo),
//     );
//   },

//   /* 파티 관련 */
//   C2SCreateParty: (partyId_string, leaderId_int) => {
//     return makePacket(
//       packetId.C2SCreateParty,
//       payload.C2SCreateParty(partyId_string, leaderId_int),
//     );
//   },
//   S2CCreateParty: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CCreateParty,
//       payload.S2CCreateParty(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   C2SInviteParty: (partyId_string, nickname_string) => {
//     return makePacket(
//       packetId.C2SInviteParty,
//       payload.C2SInviteParty(partyId_string, nickname_string),
//     );
//   },
//   S2CInviteParty: (leaderNickname_string, partyId_string, memberId_int) => {
//     return makePacket(
//       packetId.S2CInviteParty,
//       payload.S2CInviteParty(
//         leaderNickname_string,
//         partyId_string,
//         memberId_int,
//       ),
//     );
//   },
//   C2SJoinParty: (partyId_string, newMemberId_int) => {
//     return makePacket(
//       packetId.C2SJoinParty,
//       payload.C2SJoinParty(partyId_string, newMemberId_int),
//     );
//   },
//   S2CJoinParty: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CJoinParty,
//       payload.S2CJoinParty(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   C2SLeaveParty: (partyId_string, leftPlayerId_int) => {
//     return makePacket(
//       packetId.C2SLeaveParty,
//       payload.C2SLeaveParty(partyId_string, leftPlayerId_int),
//     );
//   },
//   S2CLeaveParty: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CLeaveParty,
//       payload.S2CLeaveParty(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   C2SSetPartyLeader: (partyId_string, memberId_int) => {
//     return makePacket(
//       packetId.C2SSetPartyLeader,
//       payload.C2SSetPartyLeader(partyId_string, memberId_int),
//     );
//   },
//   S2CSetPartyLeader: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CSetPartyLeader,
//       payload.S2CSetPartyLeader(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   S2CKickOutMember: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CKickOutMember,
//       payload.S2CKickOutMember(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   S2CAllowInvite: (
//     partyId_string,
//     leaderId_int,
//     memberCount_int,
//     members_ArrayOfMemberId,
//   ) => {
//     return makePacket(
//       packetId.S2CAllowInvite,
//       payload.S2CAllowInvite(
//         partyId_string,
//         leaderId_int,
//         memberCount_int,
//         members_ArrayOfMemberId,
//       ),
//     );
//   },
//   /* 플레이어 레벨업 */
//   C2SAddExp: (count_int) => {
//     return makePacket(packetId.C2SAddExp, { count: count_int });
//   },
//   S2CAddExp: (updatedExp_int) => {
//     return makePacket(packetId.S2CAddExp, { updatedExp: updatedExp_int });
//   },
//   S2CLevelUp: (playerId_int, updatedLevel_int, newTargetExp_int, updatedExp_int, abilityPoint_int) => {
//     return makePacket(packetId.S2CLevelUp, {
//       playerId: playerId_int,
//       updatedLevel: updatedLevel_int,
//       newTargetExp: newTargetExp_int,
//       updatedExp: updatedExp_int,
//       abilityPoint: abilityPoint_int,
//     });
//   },
//   C2SSelectAP: (investPoints_ArrayOfInvestPoint) => {
//     return makePacket(packetId.C2SSelectAP, {
//       investPoints: investPoints_ArrayOfInvestPoint,
//     });
//   },
//   S2CSelectAP: (statInfo_StatInfo) => {
//     return makePacket(packetId.S2CSelectAP, {
//       statInfo: statInfo_StatInfo,
//     });
//   },
//   S2CDisbandParty: (msg_string) => {
//     return makePacket(
//       packetId.S2CDisbandParty,
//       payload.S2CDisbandParty(msg_string),
//     );
//   },

//   /* 던전 관련 */
//   C2SDungeonEnter: (dungeonCode_int, partyId_string) => {
//     return makePacket(
//       packetId.C2SDungeonEnter,
//       payload.C2SDungeonEnter(dungeonCode_int, partyId_string),
//     );
//   },
//   S2CDungeonEnter: (dungeonInfo_DungeonInfo, player_PlayerStatus) => {
//     return makePacket(
//       packetId.S2CDungeonEnter,
//       payload.S2CDungeonEnter(dungeonInfo_DungeonInfo, player_PlayerStatus),
//     );
//   },
//   C2SDungeonLeave: () => {
//     return makePacket(packetId.C2SDungeonLeave);
//   },
//   S2CDungeonLeave: () => {
//     return makePacket(packetId.S2CDungeonLeave);
//   },
//   //#endregion
//   //#region /* 전투 관련 */
//   C2SAttack: (targetId_int, attackType_AttackType) => {
//     return makePacket(
//       packetId.C2SAttack,
//       payload.C2SAttack(targetId_int, attackType_AttackType),
//     );
//   },
//   S2CAttack: (attackerId_int, attackType_AttackType, animCode_int) => {
//     return makePacket(
//       packetId.S2CAttack,
//       payload.S2CAttack(attackerId_int, attackType_AttackType, animCode_int),
//     );
//   },
//   C2SHit: (attackerId_int, attackType_AttackType, hitPlayerId_int) => {
//     return makePacket(
//       packetId.C2SHit,
//       payload.C2SHit(attackerId_int, attackType_AttackType, hitPlayerId_int),
//     );
//   },
//   S2CHit: (hitPlayerId_int, animCode_int, damage_int, updatedHp_float) => {
//     return makePacket(
//       packetId.S2CHit,
//       payload.S2CHit(
//         hitPlayerId_int,
//         animCode_int,
//         damage_int,
//         updatedHp_float,
//       ),
//     );
//   },
//   S2CDie: (deadPlayerId_int, animCode_int) => {
//     return makePacket(
//       packetId.S2CDie,
//       payload.S2CDie(deadPlayerId_int, animCode_int),
//     );
//   },
//   //#endregion
//   //#region /* 몬스터 이동 관련 */
//   C2SMonsterLocation: (transform_TransformInfo) => {
//     return makePacket(
//       packetId.C2SMonsterLocation,
//       payload.C2SMonsterLocation(transform_TransformInfo),
//     );
//   },
//   S2CMonsterLocation: (monsterId_int, transform_TransformInfo) => {
//     return makePacket(
//       packetId.S2CMonsterLocation,
//       payload.S2CMonsterLocation(monsterId_int, transform_TransformInfo),
//     );
//   },
//   //#endregion
//   //#region /* 채집 관련 */

//   S2CResourcesList: (resources_resource) => {
//     return makePacket(
//       packetId.S2CResourcesList,
//       payload.S2CResourcesList(resources_resource),
//     );
//   },
//   S2CUpdateDurability: (placedId_int, durabillity_int) => {
//     return makePacket(
//       packetId.S2CUpdateDurability,
//       payload.S2CUpdateDurability(placedId_int, durabillity_int),
//     );
//   },
//   C2SStartGathering: (placedId_int) => {
//     return makePacket(
//       packetId.C2SStartGathering,
//       payload.C2SStartGathering(placedId_int),
//     );
//   },
//   S2CStartGathering: (placedId_int, angle_int, difficulty_int) => {
//     return makePacket(
//       packetId.S2CStartGathering,
//       payload.S2CStartGathering(placedId_int, angle_int, difficulty_int),
//     );
//   },
//   C2SGatheringSkillCheck: (placedId_int, deltatime_int) => {
//     return makePacket(
//       packetId.C2SGatheringSkillCheck,
//       payload.C2SGatheringSkillCheck(placedId_int, deltatime_int),
//     );
//   },
//   S2CGatheringSkillCheck: (placedId_int, durabillity_int) => {
//     return makePacket(
//       packetId.S2CGatheringSkillCheck,
//       payload.S2CGatheringSkillCheck(placedId_int, durabillity_int),
//     );
//   },
//   S2CGatheringDone: (placedId_int, ItemId_int, quentity_int) => {
//     return makePacket(
//       packetId.S2CGatheringDone,
//       payload.S2CGatheringDone(placedId_int, ItemId_int, quentity_int),
//     );
//   },

//   //#endregion
// };

// export default Packet;
