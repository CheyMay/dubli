const { runLeadDuplicateScenario } = require("../services/duplicates/leadDuplicates");
const { logger } = require("../utils/logger");

async function handleDigitalPipelineWebhook(req, res) {
  res.status(200).send("ok");

  try {
    const payload = req.body;

    const event = payload?.event || {};
    const data = event?.data || {};

    const leadId = data?.id || null;
    const pipelineId = data?.pipeline_id || null;
    const statusId = data?.status_id || null;

    // Подстрой под фактический payload / свою схему сохранения
    const accountId =
      payload?.account_id ||
      payload?.account?.id ||
      null;

    const subdomain =
      payload?.subdomain ||
      payload?.account?.subdomain ||
      null;

    logger.info("DP webhook received", {
      leadId,
      pipelineId,
      statusId,
      accountId,
      subdomain
    });

    if (!leadId) {
      logger.warn("DP webhook without leadId", { payload });
      return;
    }

    await runLeadDuplicateScenario({
      accountId,
      subdomain,
      leadId,
      pipelineId,
      statusId
    });
  } catch (error) {
    logger.error("DP controller failed", {
      message: error.message,
      status: error.response?.status || null,
      data: error.response?.data || null,
      url: error.config?.url || null,
      baseURL: error.config?.baseURL || null,
      method: error.config?.method || null,
      stack: error.stack
    });
  }
}

module.exports = { handleDigitalPipelineWebhook };
