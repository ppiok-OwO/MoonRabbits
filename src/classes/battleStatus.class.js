import BattleEntity from './battleEntity.class.js';
import { createRnadNum } from '../utils/math/createRandNum.js';
import { getPlayerSession } from '../session/sessions.js';
import { config } from '../config/config.js';
import payloadData from '../utils/packet/payloadData.js';
import { leaveDungeonResponseHandler } from '../handlers/dungeon/response/LeaveDungeonResponse.handler.js';
import { playerBattleLogResponseHandler } from '../handlers/dungeon/response/playerBattleLogResponse.handler.js';
import { monsterActionResponseHandler } from '../handlers/dungeon/response/monsterActionResponse.handler.js';
import { playerActionResponseHandler } from '../handlers/dungeon/response/playerActionResponse.handler.js';
class BattleStatus {
  constructor(dungeon, players, monsters) {
    this.playerSession = getPlayerSession();
    this.dungeon = dungeon;
    this.entity = [];
    console.log(players);
    players.forEach((player) => {
      this.entity.push(
        new BattleEntity(
          dungeon,
          player.id,
          player.nickname,
          0,
          false,
          player.getPlayerStat(),
        ),
      );
    });
    monsters.forEach((monster) => {
      this.entity.push(
        new BattleEntity(
          dungeon,
          monster.idx,
          monster.name,
          1,
          true,
          monster.getMonsterStat(),
        ),
      );
    });
    this.turnIndex = -1;
    this.turnPassed = true;
  }

  getPlayerIndex(playerId) {
    return this.entity.findIndex((player) => {
      return player.Ai === false && player.id == playerId;
    });
  }
  getMonsterIndex(monsterId) {
    return this.entity.findIndex((monster) => {
      return monster.Ai === true && monster.id == monsterId;
    });
  }
  nextTurnIndex() {
    this.turnPassed = true;
    return ++this.turnIndex;
  }

  attackEntity(attackerId, defenderId) {
    const attacker = this.entity[attackerId];
    const defender = this.entity[defenderId];
    defender.subHp(attacker.getAtk() - defender.getDef());
    if (attacker.Ai) {
      monsterActionResponseHandler(this.dungeon, attacker.id, 0);
    } else {
      playerActionResponseHandler(this.dungeon, attacker.id, 0);
    }
    this.entity[attackerId].subTurn(this);
  }

  findFoe(side) {
    const foe = [];
    for (let i = 0; i < this.entity.length; i++) {
      if (this.entity[i].getHp() > 0 && this.entity[i].side != side) {
        foe.push(i);
      }
    }
    return foe;
  }

  battleLoop() {
    if (this.turnPassed === false) return;
    this.turnPassed = false;
    while (true) {
      if (this.turnIndex < 0 || this.turnIndex >= this.entity.length) {
        this.turnIndex = 0;
        this.entity.sort((a, b) => {
          return a.getSpeed() - b.getSpeed();
        });
        console.log(this.entity);
      }
      const controlEntity = this.entity[this.turnIndex];
      console.log('controlEntity: ' + controlEntity);
      console.log('this.turnIndex: ' + this.turnIndex);
      console.log('controlEntity.getHp()' + controlEntity.getHp());
      console.log('controlEntity.getTurn()' + controlEntity.getTurn());
      if (controlEntity.getHp() > 0 && controlEntity.getTurn() > 0) {
        const foe = this.findFoe(controlEntity.side);

        if (foe.length === 0) {
          //전투 종료(적 없음)
          leaveDungeonResponseHandler(this.dungeon);
          return;
        }

        if (controlEntity.Ai) {
          //몬스터 컨트롤 S_MonsterAction S_SetMonsterHp S_SetPlayerHp
          const target = createRnadNum(0, foe.length - 1);
          this.attackEntity(this.turnIndex, foe[target]);
          //target 공격
        } else {
          //최상위 선택지 목록 보내기
          const btns = [];
          btns.push(payloadData.BtnInfo('공격', true));

          playerBattleLogResponseHandler(
            this.playerSession.getPlayerById(controlEntity.id),
            config.battletag.Menu,
            '',
            false,
            btns,
          );
          return;
          //플레이어 컨트롤 S_BattleLog
        }
      } else {
        this.nextTurnIndex();
      }
    }
  }
}

export default BattleStatus;
