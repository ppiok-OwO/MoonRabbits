const cPacket = {
  C2SRegister: (email_string, pw_string, pwCheck_string) => {
    return { email: email_string, pw: pw_string, pwCheck: pwCheck_string };
  },
  C2SLogin: (email_string, pw_string) => {
    return { email: email_string, pw: pw_string };
  },
  C2SCreateCharacter: (nickname_string, classCode_int) => {
    return { nickname: nickname_string, classCode: classCode_int };
  },
  C2SPlayerMove: (
    startPosX_float,
    startPosY_float,
    startPosZ_float,
    targetPosX_float,
    targetPosY_float,
    targetPosZ_float,
  ) => {
    return {
      startPosX: startPosX_float,
      startPosY: startPosY_float,
      startPosZ: startPosZ_float,
      targetPosX: targetPosX_float,
      targetPosY: targetPosY_float,
      targetPosZ: targetPosZ_float,
    };
  },
  // !!! 기존 C_Enter와 같은 역할임다
  // !!! class -> classCode로 속성명 변경됐습니다
  C2STownEnter: (nickname_string, classCode_int) => {
    return { nickname: nickname_string, classCode: classCode_int };
  },
  C2STownLeave: () => {
    return {};
  },
  // !!! 기존 C_Animation와 같은 역할임다
  C2SAnimation: (animCode_int) => {
    return { animCode: animCode_int };
  },
  // !!! 기존 C_Move와 같은 역할임다
  C2SPlayerLocation: (transform_TransformInfo) => {
    return { transform: transform_TransformInfo };
  },
  // !!! 기존 C_Chat와 같은 역할임다
  C2SChat: (playerId_int, senderName_string, chatMsg_string) => {
    return {
      playerId: playerId_int,
      senderName: senderName_string,
      chatMsg: chatMsg_string,
    };
  },
  // !!! 기존 C_EnterDungeon와 같은 역할임다
  // !!! partyId만 추가됐는데, optional 속성이라 안 넣으셔도 됩니당
  C2SDungeonEnter: (dungeonCode_int, partyId_int) => {
    return partyId_int
      ? { dungeonCode: dungeonCode_int, partyId: partyId_int }
      : { dungeonCode: dungeonCode_int };
  },
  // !!! 기존 C_PlayerResponse는 제거됐습니다!

  // 플레이어 레벨업
  C2SAddExp: (count_int) => {
    return { count: count_int };
  },
  C2SSelectAP: (investPoints_ArrayOfInvestPoint) => {
    return {
      investPoints: investPoints_ArrayOfInvestPoint,
    };
  },

  /* 기존 코드 */
  C_Enter: (nickname_string, classCode_int) => {
    return {
      nickname: nickname_string,
      classCode: class_int,
    };
  },
  C_Move: (transform_TransformInfo) => {
    return {
      transform: transform_TransformInfo,
    };
  },
  C_Animation: (animCode_int) => {
    return {
      animCode: animCode_int,
    };
  },
  C_Chat: (playerId_int, senderName_string, chatMsg_string) => {
    return {
      playerId: playerId_int,
      senderName: senderName_string,
      chatMsg: chatMsg_string,
    };
  },
  C_EnterDungeon: (dungeonCode_int) => {
    return {
      dungeonCode: dungeonCode_int,
    };
  },
  C_PlayerResponse: (responseCode_int) => {
    return {
      responseCode: responseCode_int,
    };
  },
};

export default cPacket;
