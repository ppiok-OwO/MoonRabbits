import { getPartySession } from './sessions.js';

addParty = (party) => {
  const partySession = getPartySession();
  partySession.set(party.partyId, party);
};

getPartyByPartyLeaderId = (partyLeaderId) => {
  const partySession = getPartySession();

  for (const party of partySession) {
    if (party.partyLeaderId === partyLeaderId) {
      return party;
    }
  }

  return null;
};
