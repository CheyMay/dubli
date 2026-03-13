const axios = require("axios");

function createAmoClient({ subdomain, accessToken }) {
  return axios.create({
    baseURL: `https://${subdomain}.amocrm.ru/api/v4`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    timeout: 15000
  });
}

module.exports = { createAmoClient };
