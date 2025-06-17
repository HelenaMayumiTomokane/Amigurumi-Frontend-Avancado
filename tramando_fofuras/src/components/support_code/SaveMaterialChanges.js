import * as API from './API';

export async function saveMaterialChanges(originalList, currentList) {
  const changes = {
    created: [],
    updated: [],
    deleted: []
  };

  // Índices por material_id
  const originalById = Object.fromEntries(
    originalList
      .filter(item => item.material_id != null)
      .map(item => [item.material_id, item])
  );

  const currentById = Object.fromEntries(
    currentList
      .filter(item => item.material_id != null)
      .map(item => [item.material_id, item])
  );

  // Detecta deletados (presentes no original, não no atual)
  for (const id in originalById) {
    if (!(id in currentById)) {
      changes.deleted.push(originalById[id]);
    }
  }

  // Detecta atualizados (presentes nos dois, mas com alguma alteração)
  for (const id in currentById) {
    if (id in originalById) {
      const original = originalById[id];
      const current = currentById[id];

      const hasChanged = ['material_name', 'quantity', 'list_id', 'colour_id', 'amigurumi_id'].some(key => {
        const originalVal = original[key];
        const currentVal = current[key];
        return originalVal !== currentVal;
      });

      if (hasChanged) {
        changes.updated.push(current);
      }
    }
  }

  // Detecta criados (sem material_id)
  const created = currentList.filter(item => item.material_id == null);
  changes.created.push(...created);

  // Envia as chamadas à API
  const results = {
    created: [],
    updated: [],
    deleted: []
  };

  // Criados
  for (const item of changes.created) {
    const res = await API.APIPost_MaterialList(
      item.amigurumi_id,
      item.material_name,
      item.quantity,
      item.list_id,
      item.colour_id
    );
    results.created.push(res);
  }

  // Atualizados
  for (const item of changes.updated) {
    const res = await API.APIPut_MaterialList(
      item.material_id,
      item.material_name,
      item.quantity,
      item.list_id,
      item.colour_id,
      item.amigurumi_id
    );
    results.updated.push(res);
  }

  // Deletados
  for (const item of changes.deleted) {
    const res = await API.APIDelete_MaterialList(item.material_id);
    results.deleted.push(res);
  }

  return results;
}


export default saveMaterialChanges