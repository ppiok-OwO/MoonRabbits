import Party from '../party.class.js';

class PartySession {
  parties = new Map();

  addParty(socket, player) {
    const newParty = new Party(socket, player);
    this.parties.set(newParty.getId(), newParty);

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

  getAllPartyEntries() {
    return this.parties.entries();
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
