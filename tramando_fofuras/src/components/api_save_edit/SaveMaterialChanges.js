import * as API from '../api/Material_API';

export async function saveMaterialChanges(originalList, currentList) {
  const changes = {
    created: [],
    updated: [],
    deleted: []
  };

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

  for (const id in originalById) {
    if (!(id in currentById)) {
      changes.deleted.push(originalById[id]);
    }
  }

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

  const created = currentList.filter(item => item.material_id == null);
  changes.created.push(...created);

  const results = {
    created: [],
    updated: [],
    deleted: []
  };

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

  for (const item of changes.deleted) {
    const res = await API.APIDelete_MaterialList(item.material_id);
    results.deleted.push(res);
  }

  return results;
}


export default saveMaterialChanges