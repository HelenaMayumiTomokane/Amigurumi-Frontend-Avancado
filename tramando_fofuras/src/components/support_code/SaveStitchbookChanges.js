import * as API from './API';

export async function saveStitchbookChanges(originalList, currentList) {
  const changes = {
    created: [],
    updated: [],
    deleted: []
  };

  // Índice por line_id (existentes)
  const originalById = Object.fromEntries(
    originalList.filter(item => item.line_id != null).map(item => [item.line_id, item])
  );
  const currentById = Object.fromEntries(
    currentList.filter(item => item.line_id != null).map(item => [item.line_id, item])
  );

  // Deletados
  for (const id in originalById) {
    if (!(id in currentById)) {
      changes.deleted.push(originalById[id]);
    }
  }

  // Atualizados
  for (const id in currentById) {
    if (id in originalById) {
      const original = originalById[id];
      const current = currentById[id];
      const hasChanged = ['amigurumi_id', 'observation', 'element_id', 'number_row', 'colour_id', 'stich_sequence']
        .some(key => original[key] !== current[key]);

      if (hasChanged) {
        changes.updated.push(current);
      }
    }
  }

  // Criados (novos sem line_id)
  changes.created = currentList.filter(item => item.line_id == null);

  const results = {
    created: [],
    updated: [],
    deleted: []
  };

  // === POST ===
  const groupedCreated = {};
  for (const item of changes.created) {
    const key = `${item.element_id}|${item.element_name}|${item.element_order}|${item.repetition}`;
    if (!groupedCreated[key]) {
      groupedCreated[key] = {
        amigurumi_id: item.amigurumi_id,
        element_id: item.element_id,
        element_name: item.element_name,
        element_order: item.element_order,
        repetition: item.repetition,
        lines: []
      };
    }
    groupedCreated[key].lines.push({
      number_row: parseInt(item.number_row),
      stich_sequence: String(item.stich_sequence),
      observation: String(item.observation),
      colour_id: parseInt(item.colour_id)
    });
  }

  for (const key in groupedCreated) {
    const group = groupedCreated[key];
    const res = await API.APIPost_StitchbookFull(
      group.amigurumi_id,
      group.element_id,
      group.element_name,
      group.element_order,
      group.repetition,
      group.lines
    );
    results.created.push(res);
  }

  // === PUT ===
  const groupedUpdated = {};
  for (const item of changes.updated) {
    const key = `${item.element_id}|${item.element_name}|${item.element_order}|${item.repetition}`;
    if (!groupedUpdated[key]) {
      groupedUpdated[key] = {
        amigurumi_id: item.amigurumi_id,
        element_id: item.element_id,
        element_name: item.element_name,
        element_order: item.element_order,
        repetition: item.repetition,
        lines: []
      };
    }
    groupedUpdated[key].lines.push({
      line_id: parseInt(item.line_id),
      number_row: parseInt(item.number_row),
      stich_sequence: String(item.stich_sequence),
      observation: String(item.observation),
      colour_id: parseInt(item.colour_id)
    });
  }

  for (const key in groupedUpdated) {
    const group = groupedUpdated[key];
    const res = await API.APIPut_StitchbookFull(
      group.amigurumi_id,
      group.element_id,
      group.element_name,
      group.element_order,
      group.repetition,
      group.lines
    );
    results.updated.push(res);
  }

  // === DELETE ===
  const groupedDeleted = {};
  for (const item of changes.deleted) {
    const key = `${item.element_id}`;
    if (!groupedDeleted[key]) {
      groupedDeleted[key] = {
        element_id: parseInt(item.element_id),
        lines: []
      };
    }
    groupedDeleted[key].lines.push({
      line_id: parseInt(item.line_id),
    });
  }

  for (const key in groupedDeleted) {
    const group = groupedDeleted[key];
    const res = await API.APIDelete_StitchbookFull(group.element_id, group.lines);
    results.deleted.push(res);
  }

  return results;
}

export default saveStitchbookChanges;
