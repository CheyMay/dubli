function choosePrimaryEntity(items, strategy = "oldest") {
  const sorted = [...items].sort((a, b) => {
    const aCreated = Number(a.created_at || 0);
    const bCreated = Number(b.created_at || 0);

    if (aCreated !== bCreated) {
      return aCreated - bCreated;
    }

    return Number(a.id || 0) - Number(b.id || 0);
  });

  if (strategy === "newest") {
    return {
      primary: sorted[sorted.length - 1],
      secondary: sorted.slice(0, -1)
    };
  }

  return {
    primary: sorted[0],
    secondary: sorted.slice(1)
  };
}

function buildLeadPayload({
  primary,
  secondary,
  fieldValueStrategy = "primary_first"
}) {
  const byFieldId = new Map();

  const sources = fieldValueStrategy === "secondary_first"
    ? [...secondary, primary]
    : [primary, ...secondary];

  for (const entity of sources) {
    const fields = Array.isArray(entity?.custom_fields_values)
      ? entity.custom_fields_values
      : [];

    for (const field of fields) {
      if (!byFieldId.has(field.field_id)) {
        byFieldId.set(field.field_id, {
          field_id: field.field_id,
          values: Array.isArray(field.values) ? [...field.values] : []
        });
      }
    }
  }

  return {
    id: primary.id,
    name: primary.name,
    price: primary.price,
    custom_fields_values: [...byFieldId.values()]
  };
}

module.exports = {
  choosePrimaryEntity,
  buildLeadPayload
};
