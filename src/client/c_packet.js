import { config } from '../config/config.js';
import makePacket from '../utils/packet/makePacket.js';

const cPacket = {
  C_Enter: (nickname_string, class_int) => {
    return {
      nickname: nickname_string,
      class: class_int,
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
