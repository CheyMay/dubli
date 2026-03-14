const express = require("express");
const { settingsService } = require("../services/settings/settingsService");

const router = express.Router();

/**
 * Сохранение контекста аккаунта от фронта виджета
 */
router.post("/context", async (req, res) => {
  try {
    const {
      account_id,
      subdomain,
      access_token,
      refresh_token,
      settings
    } = req.body || {};

    if (!subdomain || !access_token) {
      return res.status(400).json({
        ok: false,
        message: "subdomain and access_token are required"
      });
    }

    const context = await settingsService.saveIntegrationContext({
      accountId: account_id || null,
      subdomain,
      accessToken: access_token,
      refreshToken: refresh_token || null,
      settings: settings || {}
    });

    return res.json({
      ok: true,
      context: {
        accountId: context.accountId,
        subdomain: context.subdomain
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
});

/**
 * Сохранение настроек сценария дублей сделок
 */
router.post("/lead-scenario", async (req, res) => {
  try {
    const {
      account_id,
      subdomain,
      pipeline_id,
      status_id,
      settings
    } = req.body || {};

    if (!subdomain && !account_id) {
      return res.status(400).json({
        ok: false,
        message: "account_id or subdomain is required"
      });
    }

    const result = await settingsService.saveLeadScenarioSettings({
      accountId: account_id || null,
      subdomain: subdomain || null,
      pipelineId: pipeline_id || null,
      statusId: status_id || null,
      settings: settings || {}
    });

    return res.json({
      ok: true,
      settings: result
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
});

module.exports = router;
