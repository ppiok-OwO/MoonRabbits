import { getGameAssets } from '../../init/assets.js';
import Packet from '../../utils/packet/packet.js';

export const craftHandler = async (socket, packetData) => {
  const { recipeId, materialItems } = packetData; // 조합식ID, 재료 정보 [{itemId, count}]

  const recipeInfo = getGameAssets.recipes.data.find(recipe => recipe.recipe_id === recipeId);
  if(!recipeInfo) {
    socket.emit(new Error("C2SCraft : 그런 레시피 없음"));
  }

  // 클라이언트에 결과로 보내줄 조합아이템
  const itemId = recipeInfo.craft_item_id;

  // 전달받은 재료의 개수로 각각 최대 조합 개수 계산
  const maxCounts = recipeInfo.material_items.map((material)=>{
    let c2sMaterial = materialItems.find(m => m.itemId === material.item_id);
    if(!c2sMaterial) {
        socket.emit(new Error("C2SCraft : recipe 재료가 없음"));
        return 0;
    }
    return Math.floor(c2sMaterial.count / material.count);
  });

  // 각 재료의 최대 조합 수중에 최소값만큼 조합 가능
  const count = Math.min(...maxCounts);

  // 패킷 생성 및 클라이언트 반영
  try {
    socket.write(Packet.S2CCraft(itemId, count));
  } catch (error) {
    socket.emit(new Error("S2CCraft 패킷 생성 에러"));
  }
};
