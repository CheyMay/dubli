const settingsService = {
  async getIntegrationContext() {
    // Заглушка.
    // Потом сюда подключишь БД и хранение токенов/поддомена по account_id.
    return {
      subdomain: "example",
      accessToken: "ACCESS_TOKEN"
    };
  },

  async getLeadScenarioSettings({ pipelineId, statusId }) {
    // Заглушка.
    // Потом сюда пойдут настройки из frontend + DP.
    return {
      enabled: true,
      pipelineId,
      statusId,
      primary_lead_strategy: "oldest",
      field_value_strategy: "primary_first"
    };
  }
};

module.exports = { settingsService };
