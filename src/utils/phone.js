function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function extractPhones(contact) {
  const fields = Array.isArray(contact?.custom_fields_values)
    ? contact.custom_fields_values
    : [];

  const result = [];

  for (const field of fields) {
    if (field.field_code !== "PHONE") continue;
    if (!Array.isArray(field.values)) continue;

    for (const item of field.values) {
      const normalized = normalizePhone(item?.value);
      if (normalized) result.push(normalized);
    }
  }

  return [...new Set(result)];
}

module.exports = {
  normalizePhone,
  extractPhones
};
