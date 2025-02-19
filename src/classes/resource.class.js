import { getGameAssets } from '../init/assets';
import { createRandNum } from '../utils/math/createRandNum';

class Resource {
  constructor(idx, resourceId, data) {
    this.idx = idx;
    this.resourceId = resourceId;
    this.startTime = 0;
    this.data = data;
    this.durability = this.data.resource_durability;
    this.difficulty = this.data.resource_difficulty;
    this.angle = 180;
  }
  getResourceId() {
    return this.resourceId;
  }
  getStartTime() {
    return this.startTime;
  }
  getData() {
    return this.data;
  }
  getDurability() {
    return this.durability;
  }
  getDifficulty() {
    return this.difficulty;
  }
  getRespawnTime(){
    return this.data.resource_respawn * 1000;
  }
  getAngle() {
    this.startTime = Date.now();
    return (this.angle = createRandNum(30, 330));
  }
  subDurability(sub = 1) {
    return (this.durability -= sub);
  }
  resetDurability() {
    return (this.durability = this.data.resource_durability);
  }

  CheckValidateTiming(deltatime) {
    const validTime = (5000 / 36 ) * this.angle;
    const validTimeRange = (5000 / 36 ) * 60/ this.difficulty;

    if (
      Math.abs(deltatime - validTime) < validTimeRange &&
      Math.abs(Date.now() - this.startTime - validTime) < validTimeRange + 50
    ) {
      return --this.durability;
    }
    return -1;
  }

  dropItem() {
    let sum = 0;
    const dropItemArr = [];
    for (let i = 0; i < this.data.drop_item.length; i++) {
      dropItemArr.push((sum += this.data.drop_item[i]));
    }
    const randNum = createRandNum(0, sum);
    return this.data.drop_item[
      dropItemArr.findIndex((value) => {
        return value >= randNum;
      })
    ].item;
  }
}

export default Resource;
