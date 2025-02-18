import Party from '../party.class.js';

class PartySession {
  parties = new Map();

  addParty(party) {
    const newParty = new Party();
    this.parties.set(newParty.getId(), newParty);

    return this.parties;
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
