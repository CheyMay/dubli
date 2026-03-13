async function getLeadById({ client, leadId }) {
  const response = await client.get(`/leads/${leadId}`);
  return response.data;
}

async function updateLeadById({ client, leadId, payload }) {
  const response = await client.patch(`/leads/${leadId}`, payload);
  return response.data;
}

module.exports = {
  getLeadById,
  updateLeadById
};
