import { v4 as uuidV4 } from 'uuid';
import Sector from '../sector.class.js';
import handleError from '../../utils/error/errorHandler.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

class SectorSession {
  sectors = new Map();

  setSector(sectorCode, sectorId = uuidV4()) {
    const newSector = new Sector(sectorId, sectorCode);
    this.sectors.set(sectorId, newSector);
    return newSector;
  }

  removeSector(sectorId) {
    //플레이어가 섹션이 없는 경우는 존재해서는 안됨.(반드시 마을 혹은 기타 장소가 저장이 되어 있어야함.)
    //플레이어가 해당 섹터에 있을경우 섹터가 삭제되어사는 안됨. 혹은 마을로 보내줘야함.
    if (this.sectors[sectorId].players.keys.length > 0) {
      handleError(
        new CustomError(
          ErrorCodes.INVALID_INPUT,
          '플레이어가 존재하는 섹터를 삭제하려 시도함.',
        ),
      );
      return false;
    }
    return this.sectors.delete(sectorId);
  }

  getSector(sectorId) {
    return this.sectors.get(sectorId);
  }
  // !임시! 코드를 기반으로 탐색
  getSectorBySectorCode(sectorCode) {
    for (const sector of this.sectors.values()) {
      if (sector.getSectorCode() == sectorCode) return sector;
    }
  }

  getAllPlayer(sectorId) {
    const sector = this.getSector(sectorId);

    return sector.getAllPlayer().values;
  }

  getAllSectors() {
    return this.sectors.values();
  }

  clearSession() {
    this.sectors.clear();
  }
}

export default SectorSession;
