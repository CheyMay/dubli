const accountStore = new Map();
const leadScenarioStore = new Map();

function buildAccountKey({ accountId, subdomain }) {
  if (accountId) return `account:${accountId}`;
  if (subdomain) return `subdomain:${subdomain}`;
  throw new Error("accountId or subdomain is required");
}

const settingsService = {
  async saveIntegrationContext({
    accountId,
    subdomain,
    accessToken,
    refreshToken = null,
    settings = {}
  }) {
    const key = buildAccountKey({ accountId, subdomain });

    const value = {
      accountId: accountId || null,
      subdomain,
      accessToken,
      refreshToken,
      settings
    };

    accountStore.set(key, value);
    return value;
  },

  async getIntegrationContext({ accountId, subdomain }) {
    const key = buildAccountKey({ accountId, subdomain });
    const context = accountStore.get(key);

    if (!context) {
      throw new Error(`Integration context not found for key: ${key}`);
    }

    return context;
  },

  async saveLeadScenarioSettings({
    accountId,
    subdomain,
    pipelineId,
    statusId,
    settings
  }) {
    const accountKey = buildAccountKey({ accountId, subdomain });
    const key = `${accountKey}:pipeline:${pipelineId || "any"}:status:${statusId || "any"}`;

    leadScenarioStore.set(key, {
      enabled: true,
      primary_lead_strategy: "oldest",
      field_value_strategy: "primary_first",
      ...settings
    });

    return leadScenarioStore.get(key);
  },

  async getLeadScenarioSettings({
    accountId,
    subdomain,
    pipelineId,
    statusId
  }) {
    const accountKey = buildAccountKey({ accountId, subdomain });

    const exactKey = `${accountKey}:pipeline:${pipelineId || "any"}:status:${statusId || "any"}`;
    const pipelineAnyStatusKey = `${accountKey}:pipeline:${pipelineId || "any"}:status:any`;
    const fallbackKey = `${accountKey}:pipeline:any:status:any`;

    return (
      leadScenarioStore.get(exactKey) ||
      leadScenarioStore.get(pipelineAnyStatusKey) ||
      leadScenarioStore.get(fallbackKey) || {
        enabled: true,
        primary_lead_strategy: "oldest",
        field_value_strategy: "primary_first"
      }
    );
  }
};

module.exports = { settingsService };
