const { runLeadDuplicateScenario } = require("../services/duplicates/leadDuplicates");
const { logger } = require("../utils/logger");

async function handleDigitalPipelineWebhook(req, res) {
  // amoCRM ожидает быстрый ответ
  res.status(200).send("ok");

  try {
    const payload = req.body;

    const event = payload?.event || {};
    const data = event?.data || {};

    const leadId = data?.id;
    const pipelineId = data?.pipeline_id;
    const statusId = data?.status_id;

    if (!leadId) {
      logger.warn("DP webhook without leadId", { payload });
      return;
    }

    await runLeadDuplicateScenario({
      leadId,
      pipelineId,
      statusId,
      rawPayload: payload
    });
  } catch (error) {
    logger.error("DP controller failed", {
      message: error.message,
      stack: error.stack
    });
  }
}

module.exports = { handleDigitalPipelineWebhook };
