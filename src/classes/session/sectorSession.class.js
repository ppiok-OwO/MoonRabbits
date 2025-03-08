import { v4 as uuidV4 } from 'uuid';
import Sector from '../sector.class.js';
import handleError from '../../utils/error/errorHandler.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { getGameAssets } from '../../init/assets.js';
import Resource from '../resource.class.js';
import CustomError from '../../utils/error/customError.js';

class SectorSession {
  sectors = new Map();

  setSector(sectorCode, sectorId = sectorCode) {
    const resources = [];
    const gameAssets = getGameAssets();
    const sectorResources = gameAssets.sectors.data.find((value) => {
      return value.sector_code === sectorCode;
    }).resources;

    // console.log(sectorCode);
    // console.log(sectorResources);

    if (sectorResources && sectorResources.length > 0) {
      for (let i = 0; i < sectorResources.length + 1; i++) {
        if (i === 0) {
          resources.push(new Resource(i, sectorResources[0]));
          continue;
        }
        resources.push(new Resource(i, sectorResources[i - 1]));
      }
    }
    // console.log(resources.length);
    // console.log(resources);

    const newSector = new Sector(sectorId, sectorCode, resources);
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

  getSectorByCode(code) {
    const sector = Array.from(this.sectors.values()).find(
      (sector) => sector.sectorCode === code,
    );
    return sector || null; // 섹터가 존재하지 않으면 null 반환
  }

  getAllPlayerByCode(code) {
    const sector = this.getSectorByCode(code);
    if (!sector) return [];

    const playersMap = sector.getAllPlayer();
    return Array.from(playersMap.values()); // Map.values() 메서드 호출 후 배열로 변환
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
