import { getGameAssets } from '../init/assets.js';
import { createRandNum } from '../utils/math/createRandNum.js';

class Resource {
  constructor(resourceIdx, resourceId) {
    this.resourceIdx = resourceIdx;
    this.resourceId = resourceId;

    this.resourceData = getGameAssets().resources.data.find((value) => {
      return value.resource_id === resourceId;
    });
    this.durability = this.resourceData.resource_durability;
    this.difficulty = this.resourceData.resource_difficulty;
  }
  getResourceIdx() {
    return this.resourceIdx;
  }
  getResourceId() {
    return this.resourceId;
  }
  getData() {
    return this.resourceData;
  }
  getDurability() {
    return this.durability;
  }
  getDifficulty() {
    return this.difficulty;
  }
  getRespawnTime() {
    return this.resourceData.resource_respawn * 1000;
  }
  getAngle() {
    return createRandNum(70, 290);
  }
  getType() {
    if (this.resourceData.resource_type == 'Tree') {
      return 12;
    } else {
      return 11;
    }
  }
  subDurability(sub = 1) {
    return (this.durability -= sub);
  }
  resetDurability() {
    return (this.durability = this.resourceData.resource_durability);
  }

  CheckValidateTiming(angle, startTime) {
    const turnTime = 4000;
    const pingTime = 50;
    const validTimeStart = (turnTime / 360) * angle;
    const validTimeEnd =
      validTimeStart + ((turnTime / 360) * 60) / this.difficulty;

    const serverTime = (Date.now() - startTime) % turnTime;

    console.log(`20250304: serverTime: ${serverTime}
      validStart: ${validTimeStart} validEnd: ${validTimeEnd}`);

    if (
      serverTime > validTimeStart - pingTime &&
      serverTime < validTimeEnd + pingTime
    ) {
      return true;
    }
    //일단 무조건 성공으로 처리.
    return false;
  }

  dropItem() {
    let sum = 0;
    const dropItemArr = [];
    for (let i = 0; i < this.resourceData.drop_item.length; i++) {
      dropItemArr.push((sum += this.resourceData.drop_item[i].chance));
    }
    const randNum = createRandNum(0, sum);
    return this.resourceData.drop_item[
      dropItemArr.findIndex((value) => {
        return value >= randNum;
      })
    ].item_id;
  }
}

export default Resource;
