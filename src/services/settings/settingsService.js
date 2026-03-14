// Временная заглушка вместо БД.
// Потом заменить на PostgreSQL / Redis / файл / любую нормальную БД.
const accountsStore = new Map();

/**
 * Сохраняем контекст аккаунта после установки/авторизации.
 * key: referer или subdomain
 */
async function saveAccountContext({
  referer,
  subdomain,
  accessToken,
  refreshToken,
  expiresAt
}) {
  accountsStore.set(referer, {
    referer,
    subdomain,
    accessToken,
    refreshToken,
    expiresAt
  });

  return true;
}

/**
 * Получаем контекст аккаунта для backend-обработки webhook.
 */
async function getIntegrationContext({ referer }) {
  const account = accountsStore.get(referer);

  if (!account) {
    throw new Error(`Account context not found for referer: ${referer}`);
  }

  return account;
}

/**
 * Заглушка настроек сценария дублей.
 * Потом сюда можно привязать account_id / pipeline_id / status_id.
 */
async function getLeadScenarioSettings({ referer, pipelineId, statusId }) {
  return {
    enabled: true,
    referer,
    pipelineId,
    statusId,
    primary_lead_strategy: "oldest",
    field_value_strategy: "primary_first"
  };
}

module.exports = {
  settingsService: {
    saveAccountContext,
    getIntegrationContext,
    getLeadScenarioSettings
  }
};
