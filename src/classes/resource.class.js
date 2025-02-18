import { getGameAssets } from '../init/assets';
import { createRnadNum } from '../utils/math/createRandNum';

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
      this.angle.push(createRnadNum(30, 330));
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

    if (Math.abs(skillcheckTime - this.startTime - validTime) < 20) {
      return --this.durability;
    }
    return -1;
  }
}

export default Resource;
