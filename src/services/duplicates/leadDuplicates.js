const { createAmoClient } = require("../amo/client");
const { getLeadById } = require("../amo/leads");
const { getContactById, findContactsByPhone } = require("../amo/contacts");
const { getLeadLinks, getContactLinks } = require("../amo/links");
const { extractPhones } = require("../../utils/phone");
const { buildLeadMergePlan } = require("./mergePlanner");
const { settingsService } = require("../settings/settingsService");
const { logger } = require("../../utils/logger");

async function collectDuplicateLeadCandidates({ client, triggerLeadId }) {
  const triggerLinks = await getLeadLinks({ client, leadId: triggerLeadId });

  const contactLinks = triggerLinks.filter(
    (item) => item.to_entity_type === "contacts"
  );

  if (!contactLinks.length) {
    return [];
  }

  const mainContactLink =
    contactLinks.find((item) => item.metadata?.main_contact) || contactLinks[0];

  const contact = await getContactById({
    client,
    contactId: mainContactLink.to_entity_id
  });

  const phones = extractPhones(contact);
  if (!phones.length) {
    return [];
  }

  const duplicateContacts = await findContactsByPhone({
    client,
    phone: phones[0]
  });

  const leadIds = new Set([triggerLeadId]);

  for (const duplicateContact of duplicateContacts) {
    const links = await getContactLinks({
      client,
      contactId: duplicateContact.id
    });

    for (const link of links) {
      if (link.to_entity_type === "leads") {
        leadIds.add(link.to_entity_id);
      }
    }
  }

  const leads = [];
  for (const leadId of leadIds) {
    try {
      const lead = await getLeadById({ client, leadId });
      leads.push(lead);
    } catch (error) {
      logger.warn("Failed to load candidate lead", {
        leadId,
        message: error.message
      });
    }
  }

  return leads;
}

async function runLeadDuplicateScenario({
  accountId,
  subdomain,
  leadId,
  pipelineId,
  statusId
}) {
  const integration = await settingsService.getIntegrationContext({
    accountId,
    subdomain
  });

  const client = createAmoClient({
    subdomain: integration.subdomain,
    accessToken: integration.accessToken
  });

  const settings = await settingsService.getLeadScenarioSettings({
    accountId: integration.accountId,
    subdomain: integration.subdomain,
    pipelineId,
    statusId
  });

  if (!settings.enabled) {
    logger.info("Lead duplicate scenario disabled", {
      leadId,
      pipelineId,
      statusId,
      accountId: integration.accountId,
      subdomain: integration.subdomain
    });
    return;
  }

  const candidates = await collectDuplicateLeadCandidates({
    client,
    triggerLeadId: leadId
  });

  const plan = buildLeadMergePlan({
    leads: candidates,
    settings
  });

  logger.info("Lead merge plan", {
    found: plan.found,
    primaryId: plan.primary?.id || null,
    secondaryIds: plan.secondary?.map((x) => x.id) || [],
    accountId: integration.accountId,
    subdomain: integration.subdomain
  });

  return plan;
}

module.exports = { runLeadDuplicateScenario };
