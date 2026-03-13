async function getLeadLinks({ client, leadId }) {
  const response = await client.get(`/leads/${leadId}/links`);
  return response.data?._embedded?.links || [];
}

async function getContactLinks({ client, contactId }) {
  const response = await client.get(`/contacts/${contactId}/links`);
  return response.data?._embedded?.links || [];
}

async function linkEntitiesToLead({ client, leadId, links }) {
  await client.post(`/leads/${leadId}/link`, links);
}

async function unlinkEntitiesFromLead({ client, leadId, links }) {
  await client.post(`/leads/${leadId}/unlink`, links);
}

module.exports = {
  getLeadLinks,
  getContactLinks,
  linkEntitiesToLead,
  unlinkEntitiesFromLead
};
