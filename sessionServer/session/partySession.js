import { getPartySession } from './sessions.js';

export const addParty = (party) => {
  const partySession = getPartySession();
  partySession.set(party.partyId, party);
};

export const getParty = (partyId) => {
  const partySession = getPartySession();
  return partySession.get(partyId);
};

export const getPartyByPartyLeaderId = (partyLeaderId) => {
  const partySession = getPartySession();

  for (const party of partySession) {
    if (party.partyLeaderId === partyLeaderId) {
      return party;
    }
  }

  return null;
};
