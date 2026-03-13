async function getContactById({ client, contactId }) {
  const response = await client.get(`/contacts/${contactId}`);
  return response.data;
}

async function findContactsByPhone({ client, phone }) {
  const response = await client.get("/contacts", {
    params: {
      query: phone,
      limit: 50
    }
  });

  return response.data?._embedded?.contacts || [];
}

module.exports = {
  getContactById,
  findContactsByPhone
};
