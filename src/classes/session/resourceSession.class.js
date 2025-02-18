import { v4 as uuidV4 } from 'uuid';
import { getGameAssets } from '../../init/assets';
class ResourceSession {
  resourceCnt = 0;
  resources = new Map();
  gameAssets = getGameAssets();

  setResource(id) {
    const resourceIndex = gameAssets.data.findIndex((value) => {
      return value.resource_id === id;
    });
    if (resourceIndex === -1) {
      return -1;
    }

    this.resources.set(++resourceCnt, id);
    return resourceCnt;
  }

  removeResource(resourceCnt) {
    return this.resources.delete(resourceCnt);
  }

  getResource(resourceCnt) {
    return this.resources.get(resourceCnt);
  }

  getAllResources() {
    return this.resources.values();
  }

  clearSession() {
    this.resources.clear();
  }
}

export default ResourceSession;
