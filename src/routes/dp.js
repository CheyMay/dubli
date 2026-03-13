const express = require("express");
const { handleDigitalPipelineWebhook } = require("../controllers/dpController");

const router = express.Router();

router.post("/duplicates", handleDigitalPipelineWebhook);

module.exports = router;
