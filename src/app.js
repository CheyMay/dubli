const express = require("express");
const dpRouter = require("./routes/dp");
const settingsRouter = require("./routes/settings");
const healthRouter = require("./routes/health");

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/health", healthRouter);
  app.use("/amocrm/dp", dpRouter);
  app.use("/api/settings", settingsRouter);

  return app;
}

module.exports = { createApp };
