import {APIDelete_Stitchbook,APIPost_Stitchbook, APIPut_Stitchbook} from '../api/Stitchbook_API';
import {
  APIPost_Stitchbook_Sequence,
  APIPut_Stitchbook_Sequence,
  APIDelete_Stitchbook_Sequence
} from '../api/StitchbookSequence_API';

export default async function saveStitchbookChanges(originalList, currentList) {
  const originalMap = new Map(originalList.map(el => [el.element_id, el]));
  const currentMap = new Map(currentList.map(el => [el.element_id, el]));

  const newElementIdMap = new Map(); 
  const promises = [];

  for (const [originalId, originalEl] of originalMap.entries()) {
    if (!currentMap.has(originalId)) {
      promises.push(APIDelete_Stitchbook_Sequence(originalId));
    }
  }

  for (const [currentId, currentEl] of currentMap.entries()) {
    const isNew = currentId < 0;
    if (isNew) {
      const { element_id } = await APIPost_Stitchbook_Sequence(
        currentEl.amigurumi_id,
        currentEl.element_name,
        currentEl.element_order,
        currentEl.repetition
      );
      newElementIdMap.set(currentId, element_id);
    } else {
      const originalEl = originalMap.get(currentId);
      const hasChanged =
        originalEl.element_name !== currentEl.element_name ||
        originalEl.element_order !== currentEl.element_order ||
        originalEl.repetition !== currentEl.repetition;

      if (hasChanged) {
        promises.push(
          APIPut_Stitchbook_Sequence(
            currentId,
            currentEl.amigurumi_id,
            currentEl.element_name,
            currentEl.element_order,
            currentEl.repetition
          )
        );
      }
    }
  }

  await Promise.all(promises);
  promises.length = 0;

  for (const [currentId, currentEl] of currentMap.entries()) {
    const realElementId = currentId < 0 ? newElementIdMap.get(currentId) : currentId;

    const originalEl = originalMap.get(currentId);
    const originalLines = originalEl ? originalEl.lines : [];
    const originalLinesMap = new Map(originalLines.map(l => [l.line_id, l]));

    const currentLines = currentEl.lines;

    for (const origLine of originalLines) {
      if (!currentLines.find(line => line.line_id === origLine.line_id)) {
        promises.push(APIDelete_Stitchbook(origLine.line_id));
      }
    }

    for (const line of currentLines) {
      const payload = {
        number_row: parseInt(line.number_row),
        colour_id: parseInt(line.colour_id),
        stich_sequence: String(line.stich_sequence),
        observation: String(line.observation),
        amigurumi_id: currentEl.amigurumi_id,
        element_id: realElementId
      };

      if (line.line_id < 0) {
        promises.push(APIPost_Stitchbook(
          payload.amigurumi_id,
          payload.element_id,
          payload.number_row,
          payload.colour_id,
          payload.stich_sequence,
          payload.observation
        ));
      } else {
        const originalLine = originalLinesMap.get(line.line_id);
        const hasChanged =
          originalLine.number_row !== line.number_row ||
          originalLine.colour_id !== line.colour_id ||
          originalLine.stich_sequence !== line.stich_sequence ||
          originalLine.observation !== line.observation;

        if (hasChanged) {
          promises.push(APIPut_Stitchbook(
            line.line_id,
            payload.amigurumi_id,
            payload.observation,
            payload.element_id,
            payload.number_row,
            payload.colour_id,
            payload.stich_sequence
          ));
        }
      }
    }
  }

  await Promise.all(promises);
}
