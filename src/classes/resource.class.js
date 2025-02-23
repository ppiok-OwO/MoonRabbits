import { getGameAssets } from '../init/assets.js';
import { createRandNum } from '../utils/math/createRandNum.js';

class Resource {
  constructor(resourceIdx, resourceId, resourceData) {
    this.resourceIdx = resourceIdx;
    this.resourceId = resourceId;
    this.resourceData = resourceData;
    this.durability = this.resourceData.resource_durability;
    this.difficulty = this.resourceData.resource_difficulty;
  }
  getResourceId() {
    return this.resourceId;
  }
  getStartTime() {
    return this.startTime;
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
  getRespawnTime(){
    return this.resourceData.resource_respawn * 1000;
  }
  getAngle() {
    return (createRandNum(30, 330));
  }
  subDurability(sub = 1) {
    return (this.durability -= sub);
  }
  resetDurability() {
    return (this.durability = this.resourceData.resource_durability);
  }

  CheckValidateTiming(angle, startTime, deltatime) {
    const validTime = (5000 / 36 ) * angle;
    const validTimeRange = (5000 / 36 ) * 60/ this.difficulty;

    if (
      Math.abs(deltatime - validTime) < validTimeRange &&
      Math.abs(Date.now() - startTime - validTime) < validTimeRange + 50
    ) {
      return true;
    }
    return false;
  }

  dropItem() {
    let sum = 0;
    const dropItemArr = [];
    for (let i = 0; i < this.resourceData.drop_item.length; i++) {
      dropItemArr.push((sum += this.resourceData.drop_item[i]));
    }
    const randNum = createRandNum(0, sum);
    return this.resourceData.drop_item[
      dropItemArr.findIndex((value) => {
        return value >= randNum;
      })
    ].item;
  }
}

export default Resource;
