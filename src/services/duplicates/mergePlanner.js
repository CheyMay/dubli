const { choosePrimaryEntity, buildLeadPayload } = require("./fieldResolver");

function buildLeadMergePlan({ leads, settings }) {
  if (!Array.isArray(leads) || leads.length < 2) {
    return {
      found: false,
      reason: "Not enough duplicate leads"
    };
  }

  const { primary, secondary } = choosePrimaryEntity(
    leads,
    settings.primary_lead_strategy || "oldest"
  );

  const mergedPayload = buildLeadPayload({
    primary,
    secondary,
    fieldValueStrategy: settings.field_value_strategy || "primary_first"
  });

  return {
    found: true,
    primary,
    secondary,
    mergedPayload
  };
}

module.exports = { buildLeadMergePlan };
