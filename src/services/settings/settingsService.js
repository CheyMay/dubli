const settingsService = {
  async getIntegrationContext() {
    return {
      subdomain: process.env.AMO_SUBDOMAIN || "",
      accessToken: process.env.AMO_ACCESS_TOKEN || ""
    };
  },

  async getLeadScenarioSettings({ pipelineId, statusId }) {
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
