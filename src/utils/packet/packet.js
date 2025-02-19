// 게임 클라이언트와 서버 간의 통신을 위한 패킷을 생성하는 Packet객체를 정의합니다.
// packet.js

import { config } from '../../config/config.js';
import makePacket from './makePacket.js';
import payload from './payload.js';
import payloadData from './payloadData.js';

const { packetId } = config;

const Packet = {
  //#region  /* 게임 시작 관련 */
  C2SRegister: (email_string, pw_string, pwCheck_string) => {
    return makePacket(
      packetId.C2SRegister,
      payload.C2SRegister(email_string, pw_string, pwCheck_string),
    );
  },
  S2CRegister: (isSuccess_bool, msg_string) => {
    return makePacket(
      packetId.S2CRegister,
      payload.S2CRegister(isSuccess_bool, msg_string),
    );
  },
  C2SLogin: (email_string, pw_string) => {
    return makePacket(
      packetId.C2SLogin,
      payload.C2SLogin(email_string, pw_string),
    );
  },
  S2CLogin: (
    isSuccess_bool,
    msg_string,
    ownedCharacters_ArrayOwnedCharacters,
  ) => {
    return makePacket(
      packetId.S2CLogin,
      payload.S2CLogin(
        isSuccess_bool,
        msg_string,
        ownedCharacters_ArrayOwnedCharacters,
      ),
    );
  },
  C2SCreateCharacter: (nickname_string, classCode_int) => {
    return makePacket(
      packetId.C2SCreateCharacter,
      payload.C2SCreateCharacter(nickname_string, classCode_int),
    );
  },
  S2CCreateCharacter: (isSuccess_bool, msg_string) => {
    return makePacket(
      packetId.S2CCreateCharacter,
      payload.S2CCreateCharacter(isSuccess_bool, msg_string),
    );
  },
  //#endregion
  //#region /* 마을 관련 */
  C2STownEnter: (nickname_string, classCode_int) => {
    return makePacket(
      packetId.C2STownEnter,
      payload.C2STownEnter(nickname_string, classCode_int),
    );
  },
  S2CTownEnter: (player_PlayerInfo) => {
    return makePacket(
      packetId.S2CTownEnter,
      payload.S2CTownEnter(player_PlayerInfo),
    );
  },
  C2STownLeave: () => {
    return makePacket(packetId.C2STownLeave);
  },
  S2CTownLeave: () => {
    return makePacket(packetId.S2CTownLeave);
  },
  C2SAnimation: (animCode_int) => {
    return makePacket(
      packetId.C2SAnimation,
      payload.C2SAnimation(animCode_int),
    );
  },
  S2CAnimation: (playerId_int, animCode_int) => {
    return makePacket(
      packetId.S2CAnimation,
      payload.S2CAnimation(playerId_int, animCode_int),
    );
  },
  //#endregion
  //#region  /* 공통 01 - 채팅, 소환 */
  C2SChat: (playerId_int, senderName_string, chatMsg_string) => {
    return makePacket(
      packetId.C2SChat,
      payload.C2SChat(playerId_int, senderName_string, chatMsg_string),
    );
  },
  S2CChat: (playerId_int, chatMsg_string) => {
    return makePacket(
      packetId.S2CChat,
      payload.S2CChat(playerId_int, chatMsg_string),
    );
  },
  S2CPlayerSpawn: (players_ArrayOfPlayerInfo) => {
    return makePacket(
      packetId.S2CPlayerSpawn,
      payload.S2CPlayerSpawn(players_ArrayOfPlayerInfo),
    );
  },
  S2CPlayerDespawn: (playerIds_ArrayOfInt) => {
    return makePacket(
      packetId.S2CPlayerDespawn,
      payload.S2CPlayerDespawn(playerIds_ArrayOfInt),
    );
  },
  //#endregion
  //#region  /* 공통 02 - 플레이어 이동 */
  C2SPlayerMove: (
    startPosX_float,
    startPosY_float,
    startPosZ_float,
    targetPosX_float,
    targetPosY_float,
    targetPosZ_float,
  ) => {
    return makePacket(
      packetId.C2SPlayerMove,
      payload.C2SPlayerMove(
        startPosX_float,
        startPosY_float,
        startPosZ_float,
        targetPosX_float,
        targetPosY_float,
        targetPosZ_float,
      ),
    );
  },
  S2CPlayerMove: () => {
    return makePacket(packetId.S2CPlayerMove);
  },
  C2SPlayerLocation: (transform_TransformInfo) => {
    return makePacket(
      packetId.C2SPlayerLocation,
      payload.C2SPlayerLocation(transform_TransformInfo),
    );
  },
  S2CPlayerLocation: (
    playerId_int,
    transform_TransformInfo,
    isValidTransform_bool,
  ) => {
    return makePacket(
      packetId.S2CPlayerLocation,
      payload.S2CPlayerLocation(
        playerId_int,
        transform_TransformInfo,
        isValidTransform_bool,
      ),
    );
  },
  //#endregion
  //#region /* 공통 03 - 충돌 관련 */
  C2SPlayerCollision: (playerId_int, collisionInfo_CollisionInfo) => {
    return makePacket(
      packetId.C2SPlayerCollision,
      payload.C2SPlayerCollision(playerId_int, collisionInfo_CollisionInfo),
    );
  },
  S2CPlayerCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
    return makePacket(
      packetId.S2CPlayerCollision,
      payload.S2CPlayerCollision(
        playerId_int,
        collisionPushInfo_CollisionPushInfo,
      ),
    );
  },
  C2SMonsterCollision: (playerId_int, collisionInfo_CollisionInfo) => {
    return makePacket(
      packetId.C2SMonsterCollision,
      payload.C2SMonsterCollision(playerId_int, collisionInfo_CollisionInfo),
    );
  },
  S2CMonsterCollision: (playerId_int, collisionPushInfo_CollisionPushInfo) => {
    return makePacket(
      packetId.S2CMonsterCollision,
      S2CMonsterCollision(playerId_int, collisionPushInfo_CollisionPushInfo),
    );
  },
  //#endregion
  //#region  /* 파티 관련 */
  C2SCreateParty: (partyId_int, leaderId_int) => {
    return makePacket(
      packetId.C2SCreateParty,
      payload.C2SCreateParty(partyId_int, leaderId_int),
    );
  },
  S2CCreateParty: (
    partyId_int,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberId,
  ) => {
    return makePacket(
      packetId.S2CCreateParty,
      payload.S2CCreateParty(
        partyId_int,
        leaderId_int,
        memberCount_int,
        members_ArrayOfMemberId,
      ),
    );
  },
  C2SInviteParty: (partyId_int, nickname_string) => {
    return makePacket(
      packetId.C2SInviteParty,
      payload.C2SInviteParty(partyId_int, nickname_string),
    );
  },
  S2CInviteParty: (
    partyId_int,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberId,
  ) => {
    return makePacket(
      packetId.S2CInviteParty,
      payload.S2CInviteParty(
        partyId_int,
        leaderId_int,
        memberCount_int,
        members_ArrayOfMemberId,
      ),
    );
  },
  C2SJoinParty: (partyId_int, newMemberId_int) => {
    return makePacket(
      packetId.C2SJoinParty,
      payload.C2SJoinParty(partyId_int, newMemberId_int),
    );
  },
  S2CJoinParty: (
    partyId_int,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberId,
  ) => {
    return makePacket(
      packetId.S2CJoinParty,
      payload.S2CJoinParty(
        partyId_int,
        leaderId_int,
        memberCount_int,
        members_ArrayOfMemberId,
      ),
    );
  },
  C2SLeaveParty: (partyId_int, leftPlayerId_int) => {
    return makePacket(
      packetId.C2SLeaveParty,
      payload.C2SLeaveParty(partyId_int, leftPlayerId_int),
    );
  },
  S2CLeaveParty: (
    partyId_int,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberId,
  ) => {
    return makePacket(
      packetId.S2CLeaveParty,
      payload.S2CLeaveParty(
        partyId_int,
        leaderId_int,
        memberCount_int,
        members_ArrayOfMemberId,
      ),
    );
  },
  C2SSetPartyLeader: (partyId_int, memberId_int) => {
    return makePacket(
      packetId.C2SSetPartyLeader,
      payload.C2SSetPartyLeader(partyId_int, memberId_int),
    );
  },
  S2CSetPartyLeader: (
    partyId_int,
    leaderId_int,
    memberCount_int,
    members_ArrayOfMemberId,
  ) => {
    return makePacket(
      packetId.S2CSetPartyLeader,
      payload.S2CSetPartyLeader(
        partyId_int,
        leaderId_int,
        memberCount_int,
        members_ArrayOfMemberId,
      ),
    );
  },
  C2SBuff: (partyId_int, casterId_int, skillCode_int, targetId_int) => {
    return makePacket(
      packetId.C2SBuff,
      payload.C2SBuff(partyId_int, casterId_int, skillCode_int, targetId_int),
    );
  },
  S2CBuff: (partyId_int, players_ArrayOfPlayerInfo) => {
    return makePacket(
      packetId.S2CBuff,
      payload.S2CBuff(partyId_int, players_ArrayOfPlayerInfo),
    );
  },
  //#endregion
  //#region /* 던전 관련 */
  C2SDungeonEnter: (dungeonCode_int, partyId_int) => {
    return makePacket(
      packetId.C2SDungeonEnter,
      payload.C2SDungeonEnter(dungeonCode_int, partyId_int),
    );
  },
  S2CDungeonEnter: (dungeonInfo_DungeonInfo, player_PlayerStatus) => {
    return makePacket(
      packetId.S2CDungeonEnter,
      payload.S2CDungeonEnter(dungeonInfo_DungeonInfo, player_PlayerStatus),
    );
  },
  C2SDungeonLeave: () => {
    return makePacket(packetId.C2SDungeonLeave);
  },
  S2CDungeonLeave: () => {
    return makePacket(packetId.S2CDungeonLeave);
  },
  //#endregion
  //#region /* 전투 관련 */
  C2SAttack: (targetId_int, attackType_AttackType) => {
    return makePacket(
      packetId.C2SAttack,
      payload.C2SAttack(targetId_int, attackType_AttackType),
    );
  },
  S2CAttack: (attackerId_int, attackType_AttackType, animCode_int) => {
    return makePacket(
      packetId.S2CAttack,
      payload.S2CAttack(attackerId_int, attackType_AttackType, animCode_int),
    );
  },
  C2SHit: (attackerId_int, attackType_AttackType, hitPlayerId_int) => {
    return makePacket(
      packetId.C2SHit,
      payload.C2SHit(attackerId_int, attackType_AttackType, hitPlayerId_int),
    );
  },
  S2CHit: (hitPlayerId_int, animCode_int, damage_int, updatedHp_float) => {
    return makePacket(
      packetId.S2CHit,
      payload.S2CHit(
        hitPlayerId_int,
        animCode_int,
        damage_int,
        updatedHp_float,
      ),
    );
  },
  S2CDie: (deadPlayerId_int, animCode_int) => {
    return makePacket(
      packetId.S2CDie,
      payload.S2CDie(deadPlayerId_int, animCode_int),
    );
  },

  //#region /* 몬스터 이동 관련 */
  C2SMonsterLocation: (transform_TransformInfo) => {
    return makePacket(
      packetId.C2SMonsterLocation,
      payload.C2SMonsterLocation(monsterId_int, vector3_Object),
    );
  },
  S2CMonsterLocation: (monsterId_int, vector3_Object) => {
    return makePacket(
      packetId.S2CMonsterLocation,
      payload.S2CMonsterLocation(monsterId_int, vector3_Object),
    );
  },
  //#endregion
  //#region /* 채집 관련 */

  S2CResourcesList: (resources_resource) => {
    return makePacket(
      packetId.S2CResourcesList,
      payload.S2CResourcesList(resources_resource),
    );
  },
  S2CUpdateDurability: (placedId_int, durabillity_int) => {
    return makePacket(
      packetId.S2CUpdateDurability,
      payload.S2CUpdateDurability(placedId_int, durabillity_int),
    );
  },
  C2SStartGathering: (placedId_int) => {
    return makePacket(
      packetId.C2SStartGathering,
      payload.C2SStartGathering(placedId_int),
    );
  },
  S2CStartGathering: (placedId_int, angle_int, difficulty_int) => {
    return makePacket(
      packetId.S2CStartGathering,
      payload.S2CStartGathering(placedId_int, angle_int, difficulty_int),
    );
  },
  C2SGatheringSkillCheck: (placedId_int, deltatime_int) => {
    return makePacket(
      packetId.C2SGatheringSkillCheck,
      payload.C2SGatheringSkillCheck(placedId_int, deltatime_int),
    );
  },
  S2CGatheringSkillCheck: (placedId_int, durabillity_int) => {
    return makePacket(
      packetId.S2CGatheringSkillCheck,
      payload.S2CGatheringSkillCheck(placedId_int, durabillity_int),
    );
  },
  S2CGatheringDone: (placedId_int, ItemId_int, quentity_int) => {
    return makePacket(
      packetId.S2CGatheringDone,
      payload.S2CGatheringDone(placedId_int, ItemId_int, quentity_int),
    );
  },

  //#endregion

  /* 기존 코드 */
  // S_Enter: (player_PlayerInfo) => {
  //   return makePacket(config.packetId.S_Enter, { player: player_PlayerInfo });
  // },
  // S_Spawn: (players_ArrayOfPlayerInfo) => {
  //   return makePacket(config.packetId.S_Spawn, {
  //     players: players_ArrayOfPlayerInfo,
  //   });
  // },
  // S_Despawn: (playerIds_ArrayOfInt) => {
  //   return makePacket(config.packetId.S_Despawn, {
  //     playerIds: playerIds_ArrayOfInt,
  //   });
  // },
  // S_Move: (playerId_int, transform_TransformInfo) => {
  //   return makePacket(config.packetId.S_Move, {
  //     playerId: playerId_int,
  //     transform: transform_TransformInfo,
  //   });
  // },
  // S_Animation: (playerId_int, animCode_int) => {
  //   return makePacket(config.packetId.S_Animation, {
  //     playerId: playerId_int,
  //     animCode: animCode_int,
  //   });
  // },
  // S_Chat: (playerId_int, chatMsg_string) => {
  //   return makePacket(config.packetId.S_Chat, {
  //     playerId: playerId_int,
  //     chatMsg: chatMsg_string,
  //   });
  // },
  // S_EnterDungeon: (
  //   dungeonInfo_DungeonInfo,
  //   player_PlayerStatus,
  //   screenText_ScreenText,
  //   battleLog_BattleLog,
  // ) => {
  //   return makePacket(config.packetId.S_EnterDungeon, {
  //     dungeonInfo: dungeonInfo_DungeonInfo,
  //     player: player_PlayerStatus,
  //     screenText: screenText_ScreenText,
  //     battleLog: battleLog_BattleLog,
  //   });
  // },
  // S_LeaveDungeon: () => {
  //   return makePacket(config.packetId.S_LeaveDungeon, {});
  // },
  // S_ScreenText: (screenText_ScreenText) => {
  //   return makePacket(config.packetId.S_ScreenText, {
  //     screenText: screenText_ScreenText,
  //   });
  // },
  // S_ScreenDone: () => {
  //   return makePacket(config.packetId.S_ScreenDone, {});
  // },
  // S_BattleLog: (battleLog_BattleLog) => {
  //   return makePacket(config.packetId.S_BattleLog, {
  //     battleLog: battleLog_BattleLog,
  //   });
  // },
  // S_SetPlayerHp: (hp_float) => {
  //   return makePacket(config.packetId.S_SetPlayerHp, { hp: hp_float });
  // },
  // S_SetPlayerMp: (mp_float) => {
  //   return makePacket(config.packetId.S_SetPlayerMp, { mp: mp_float });
  // },
  // S_SetMonsterHp: (monsterIdx_int, hp_float) => {
  //   return makePacket(config.packetId.S_SetMonsterHp, {
  //     monsterIdx: monsterIdx_int,
  //     hp: hp_float,
  //   });
  // },
  // S_PlayerAction: (targetMonsterIdx_int, actionSet_ActionSet) => {
  //   return makePacket(config.packetId.S_PlayerAction, {
  //     targetMonsterIdx: targetMonsterIdx_int,
  //     actionSet: actionSet_ActionSet,
  //   });
  // },
  // S_MonsterAction: (actionMonsterIdx_int, actionSet_ActionSet) => {
  //   return makePacket(config.packetId.S_MonsterAction, {
  //     actionMonsterIdx: actionMonsterIdx_int,
  //     actionSet: actionSet_ActionSet,
  //   });
  // },
  // S_Register: (isSuccess_bool, msg_string) => {
  //   return makePacket(config.packetId.S_Register, {
  //     isSuccess: isSuccess_bool,
  //     msg: msg_string,
  //   });
  // },
  // S_Login: (
  //   isSuccess_bool,
  //   msg_string,
  //   ownedCharacters_ArrayOfOwnedCharacters,
  // ) => {
  //   return makePacket(config.packetId.S_Login, {
  //     isSuccess: isSuccess_bool,
  //     msg: msg_string,
  //     ownedCharacters: ownedCharacters_ArrayOfOwnedCharacters,
  //   });
  // },
  // S_CreateCharacter: (isSuccess_bool, msg_string) => {
  //   return makePacket(config.packetId.S_CreateCharacter, {
  //     isSuccess: isSuccess_bool,
  //     msg: msg_string,
  //   });
  // },
};

export default Packet;
