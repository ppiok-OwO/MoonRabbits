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
  getType(){
    if(this.resourceData.resource_type == "Tree"){
      return 12;
    }
    else{
      return 11;
    }
  }
  subDurability(sub = 1) {
    return (this.durability -= sub);
  }
  resetDurability() {
    return (this.durability = this.resourceData.resource_durability);
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
