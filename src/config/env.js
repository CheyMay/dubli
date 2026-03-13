const env = {
  port: Number(process.env.PORT || 83),
  amoWebhookSecret: process.env.AMO_WEBHOOK_SECRET || "",
};

module.exports = { env };
