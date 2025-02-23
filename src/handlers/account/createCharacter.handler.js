import chalk from 'chalk';
import Packet from '../../utils/packet/packet.js';
import PAYLOAD_DATA from '../../utils/packet/payloadData.js';
import {
  createInventory,
  createStat,
  findPlayerByUserId,
  findUserByNickname,
  updatePlayer,
} from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getUserSessions } from '../../session/sessions.js';

/* 캐릭터 생성 Handler */
const createCharacterHandler = async (socket, packetData) => {
  try {
    // !!! 패킷 수정에 따라 class -> classCode가 된 관계로 분해할당 그대로 하도록 수정했습니다!
    const { nickname, classCode } = packetData;

    // nickname 중복 확인
    const duplicateNickname = await findUserByNickname(nickname);
    if (duplicateNickname) {
      const isSuccess = false;
      const msg = '이미 존재하는 닉네임입니다.';
      const failResponse = Packet.S2CCreateCharacter(isSuccess, msg, []);
      return socket.write(failResponse);
    }

    // 로그인 과정을 거치지 않았는데 캐릭터 생성 요청이 들어온 경우 처리
    const userData = socket.user;
    if (!userData || !userData.userId) {
      const isSuccess = false;
      const msg = '로그인 된 사용자 정보가 없습니다.';
      return socket.write(Packet.S2CCreateCharacter(isSuccess, msg, []));
    }

    // 플레이어(캐릭터) 테이블에서 해당 사용자의 userId 검색
    const player = await findPlayerByUserId(userData.userId);

    // 기존 플레이어 데이터가 존재하는 경우,
    // nickname 또는 class_code의 값이 비어있다면 업데이트
    if (player && (!player.nickname || !player.classCode)) {
      await updatePlayer(userData.userId, nickname, classCode);
      console.log(chalk.green(`[DB Log] 플레이어 업데이트 완료: userId ${userData.userId}`));
    }
    // 이미 캐릭터 정보가 존재하는 경우에는 재생성을 막습니다.
    else {
      const isSuccess = false;
      const msg = '이미 캐릭터 정보가 존재합니다.';
      return socket.write(Packet.S2CCreateCharacter(isSuccess, msg, []));
    }

    // 캐릭터 생성 성공 여부
    const isSuccess = true;
    const msg = '캐릭터 생성에 성공했습니다.';
    console.log(`
    ${chalk.green('----------- [클라이언트에서 준 Data & socket에서 userId 확인] -------------')}
      user_Id : ${socket.user.userId}, 
      nickname : ${nickname}, 
      classCode : ${classCode}
      `);

    // 캐릭터 생성 성공 시, 스탯 및 인벤토리 생성
    const findPlayer = await findPlayerByUserId(userData.userId);

    await createStat(findPlayer.playerId);
    await createInventory(findPlayer.playerId);

    // UserSession 업데이트
    // login 이후에 userSession의 소켓 기반 임시 세션을 userId를 키로 사용한 Redis 해시로 업데이트
    const userSessionManager = getUserSessions();
    const user = userSessionManager.getUser(socket);
    if (user) {
      // userSession.class.js의 updateUserSessionAfterLogin 메서드를 호출하여
      // in-memory와 Redis에 로그인 정보를 업데이트
      await userSessionManager.updateUserSessionAfterLogin(socket, {
        userId: userData.userId,
        // 캐릭터가 없다면 빈 문자열이나 null, 캐릭터가 있으면 해당 정보를 저장
        nickname: findPlayer && findPlayer.nickname ? findPlayer.nickname : '',
        classCode: findPlayer && findPlayer.classCode ? findPlayer.classCode : '',
      });
      console.log('----- 업데이트된 userSession ----- \n', user);
    }

    // 캐릭터 생성 성공 시, 보유한 캐릭터 정보를 가져옴
    const ownedCharacters = [
      PAYLOAD_DATA.OwnedCharacter(findPlayer.nickname, findPlayer.classCode),
    ];

    const packet = Packet.S2CLogin(isSuccess, msg, ownedCharacters);
    socket.write(packet);
  } catch (error) {
    console.error(
      `${chalk.red('[createCharacterHandler Error] ')}
       ${error}
      `,
    );
    socket.emit('error', new CustomError(ErrorCodes.HANDLER_ERROR, 'createCharacterHandler 에러'));
  }
};

export default createCharacterHandler;
