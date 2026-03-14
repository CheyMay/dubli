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

    // Это место зависит от фактического payload твоего webhook.
    // Если referer/subdomain приходит иначе — надо адаптировать по реальному телу запроса.
    const referer =
      payload?.account?.subdomain ||
      payload?.referer ||
      null;

    logger.info("DP webhook received", {
      leadId,
      pipelineId,
      statusId,
      referer
    });

    if (!leadId || !referer) {
      logger.warn("Webhook missing required fields", { payload });
      return;
    }

    await runLeadDuplicateScenario({
      referer,
      leadId,
      pipelineId,
      statusId,
      rawPayload: payload
    });
  } catch (error) {
    logger.error("DP controller failed", {
      message: error.message,
      status: error.response?.status || null,
      data: error.response?.data || null
    });
  }
}

module.exports = { handleDigitalPipelineWebhook };
