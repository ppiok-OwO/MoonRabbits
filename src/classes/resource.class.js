import { getGameAssets } from '../init/assets';
import { createRandNum } from '../utils/math/createRandNum';

class Resource {
  constructor(id, resourceId, data) {
    this.id = id;
    this.resourceId = resourceId;
    this.startTime = 0;
    this.data = data;
    this.durability = data.resource_durability;
    this.difficulty = data.resource_difficulty;
    this.angle = [];
    for (let i = 0; i < this.durability; i++) {
      this.angle.push(createRandNum(30, 330));
    }
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

  CheckValidateTiming(skillcheckTime) {
    const validTime =
      (1000 / 360 / this.difficulty) * this.angle[this.durability - 1];

    if (Math.abs(skillcheckTime - this.startTime - validTime) < 100) {
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
