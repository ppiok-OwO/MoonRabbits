
## 프로토버프 구조 설계
### C_CreateParty

| 필드명           | 타입  | 설명            |
| ------------- | --- | ------------- |
| partyId       | int | 파티 ID         |
| partyLeaderId | int | 파티장의 playerId |

### S_CreateParty

| 필드명           | 타입       | 설명            |
| ------------- | -------- | ------------- |
| partyId       | int      | 파티 ID         |
| partyLeaderId | int      | 파티장의 playerId |
| playerCount   | int      | 파티 멤버 수       |
| members       | playerId | repeated      |

### C_JoinParty

| 필드명      | 타입  | 설명                   |
| -------- | --- | -------------------- |
| partyId  | int | 파티 ID                |
| memberId | int | 파티에 추가된 멤버의 playerId |

### S_JoinParty

| 필드명           | 타입       | 설명            |
| ------------- | -------- | ------------- |
| partyId       | int      | 파티 ID         |
| partyLeaderId | int      | 파티장의 playerId |
| playerCount   | int      | 파티 멤버 수       |
| members       | playerId | repeated      |

### C_LeaveParty

| 필드명      | 타입  | 설명                  |
| -------- | --- | ------------------- |
| partyId  | int | 파티 ID               |
| memberId | int | 파티를 떠난 멤버의 playerId 

### S_LeaveParty

| 필드명           | 타입       | 설명            |
| ------------- | -------- | ------------- |
| partyId       | int      | 파티 ID         |
| partyLeaderId | int      | 파티장의 playerId |
| playerCount   | int      | 파티 멤버 수       |
| members       | playerId | repeated      |

### C_DisbandParty

| 필드명     | 타입  | 설명    |
| ------- | --- | ----- |
| partyId | int | 파티 ID |

### C_HealPartyMember

| 필드명            | 타입  | 설명             |
| -------------- | --- | -------------- |
| partyId        | int | 파티 ID          |
| skillCasterID  | int | 스킬을 사용한 멤버의 ID |
| skillCode      | int | 사용한 스킬의 코드     |
| targetMemberId | int | 타겟 멤버의 플레이어 ID |

### S_HealPartyMember

| 필드명           | 타입         | 설명            |
| ------------- | ---------- | ------------- |
| partyId       | int        | 파티 ID         |
| players       | PlayerInfo | repeated      |

- 프로토버프엔 ushort가 없어서 어쩔 수 없이 int32로 통일해야 할 듯
- 비전투시에는 playerInfo 대신 playerId 배열을 쓴다.
- 전투시에는 스탯이나 좌표에 변화가 발생할 수 있으니 playerInfo를 사용한다.

## 파티 클래스, 파티 세션 구현
```JS
class Party {
  members = new Map();

  // 생성하는 플레이어가 자동으로 파티장이 된다.
  constructor(socket, player) {
    this.partyLeader = player;
    this.members.set(socket, player);
  }

  addMember(socket, player) {
    // 플레이어 인스턴스를 인자로 받아오기
    this.members.set(socket, player);
    const newMember = this.members.get(socket);

    return newMember;
  }

  removeMember(socket) {
    this.members.delete(socket);
  }

  getMember(socket) {
    return this.members.get(socket);
  }

  setPartyLeader(player) {
    // 파티장을 바꾸고 싶을 때
    this.partyLeader = player;
  }

  getPartyLeader() {
    return this.partyLeader;
  }

  getAllMembers() {
    return this.members;
  }

  disbandParty() {
    this.members.clear();
    this.partyLeaderId = null;
  }

  getPlayerInfoOfMembers() {
    const playerInfoOfMembers = [];
    for (const member of this.members.values()) {
      const memberInfo = member.getPlayerInfo();
      playerInfoOfMembers.push(memberInfo);
    }

    return playerInfoOfMembers;
  }

  notify(packet) {
    for (const member of this.members.keys()) {
      member.write(packet);
    }
  }
}

export default Party;

```

```js
import Party from '../party.class.js';

class PartySession {
  parties = new Map();
  partyId = 1;

  addParty(party) {
    const newParty = new Party();
    this.parties.set(this.partyId++, newParty);

    return newParty;
  }

  removeParty(partyId) {
    this.parties.delete(partyId);
  }

  getParty(partyId) {
    return this.parties.get(partyId);
  }

  getAllParties() {
    return this.parties;
  }

  clearSession() {
    this.parties.clear();
  }

  notify(packet) {
    // 파티플레이 중인 모든 유저에게 브로드캐스트
    for (const party of this.parties.values()) {
      party.notify(packet);
    }
  }
}

export default PartySession;

```



