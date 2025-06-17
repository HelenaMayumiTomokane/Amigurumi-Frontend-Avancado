import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as API from './API';

const Stitchbook = forwardRef(({ amigurumiId, editable = false, trigger }, ref) => {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newLineCounter, setNewLineCounter] = useState(0);
  const [newGroupCounter, setNewGroupCounter] = useState(0);

  useEffect(() => {
    if (!amigurumiId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const data = await API.APIGet_StitchbookFull();
        const filtered = data.filter(item => item.amigurumi_id === amigurumiId);

        const map = {};

        filtered.forEach(item => {
          const {
            element_id,
            amigurumi_id,
            element_name,
            element_order,
            repetition,
            lines,
            colour_id,
            number_row,
            observation,
            stich_sequence
          } = item;

          map[element_id] = {
            amigurumi_id,
            element_id,
            element_name,
            element_order,
            repetition,
            lines: Array.isArray(lines) ? lines : [],
          };

          map[element_id].lines.push({
            colour_id,
            number_row,
            observation,
            stich_sequence
          })
        });

        setGroups(map);
      } catch (err) {
        setError('Erro ao carregar dados do Stitchbook');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [amigurumiId, trigger]);

  const handleGroupChange = (elementId, field, value) => {
    setGroups(prev => {
      const copy = { ...prev };
      if (copy[elementId]) {
        copy[elementId] = { ...copy[elementId], [field]: value };
      }
      return copy;
    });
  };

  const handleLineChange = (elementId, lineId, field, value) => {
    setGroups(prev => {
      const copy = { ...prev };
      if (copy[elementId]) {
        const newLines = copy[elementId].lines.map(line =>
          line.line_id === lineId ? { ...line, [field]: value } : line
        );
        copy[elementId] = { ...copy[elementId], lines: newLines };
      }
      return copy;
    });
  };

  const addGroup = () => {
    const newId = -(newGroupCounter + 1);
    setGroups(prev => ({
      ...prev,
      [newId]: {
        amigurumi_id: amigurumiId,
        element_id: newId,
        element_name: '',
        repetition: '',
        element_order: 0,
        lines: [],
      },
    }));
    setNewGroupCounter(prev => prev + 1);
  };

  const deleteGroup = (elementId) => {
    setGroups(prev => {
      const copy = { ...prev };
      delete copy[elementId];
      return copy;
    });
  };

  const addLine = (elementId) => {
    const newId = -(newLineCounter + 1);
    setGroups(prev => {
      const copy = { ...prev };
      if (copy[elementId]) {
        copy[elementId] = {
          ...copy[elementId],
          lines: [
            ...copy[elementId].lines,
            {
              line_id: newId,
              number_row: '',
              colour_id: '',
              stich_sequence: '',
              observation: '',
            },
          ],
        };
      }
      return copy;
    });
    setNewLineCounter(prev => prev + 1);
  };

  const deleteLine = (elementId, lineId) => {
    setGroups(prev => {
      const copy = { ...prev };
      if (copy[elementId]) {
        copy[elementId] = {
          ...copy[elementId],
          lines: copy[elementId].lines.filter(line => line.line_id !== lineId),
        };
      }
      return copy;
    });
  };

  useImperativeHandle(ref, () => ({
    getOriginalList: () =>
      Object.values(groups) || [],
    getCurrentList: () =>
      Object.values(groups) || [],
    updateOriginalList: (newGroups) => {
      if (newGroups) {
        const map = {};
        newGroups.forEach(item => {
          map[item.element_id] = {
            amigurumi_id: item.amigurumi_id,
            element_id: item.element_id,
            element_name: item.element_name,
            element_order: item.element_order,
            repetition: item.repetition,
            lines: item.lines || [],
          };
        });
        setGroups(map);
      }
    },
  }));

  if (loading) return <p>Carregando Stitchbook...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {editable && <button onClick={addGroup}>Adicionar Tabela</button>}

      {Object.entries(groups)
        .sort((a, b) => a[1].element_order - b[1].element_order)
        .map(([elementId, group]) => (
          <div key={elementId} id="div_stitchbookList">
            <table>
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Nome da tabela</th>
                  <th>Repetição</th>
                  {editable && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={group.element_order}
                      onChange={e => handleGroupChange(elementId, 'element_order', e.target.value)}
                      readOnly={!editable}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={group.element_name}
                      onChange={e => handleGroupChange(elementId, 'element_name', e.target.value)}
                      readOnly={!editable}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      value={group.repetition}
                      onChange={e => handleGroupChange(elementId, 'repetition', e.target.value)}
                      readOnly={!editable}
                    />
                  </td>
                  {editable && (
                    <td>
                      <button onClick={() => deleteGroup(elementId)}>Excluir Tabela</button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>

            <br />
            <table id="stitchbook_table">
              <thead>
                <tr>
                  <th>Ordem da Linha</th>
                  <th>Cor</th>
                  <th>Sequência</th>
                  <th>Observação</th>
                  {editable && <th>Excluir Linha</th>}
                </tr>
              </thead>
              <tbody>
                {group.lines.length === 0 ? (
                  <tr><td colSpan={5}>Nenhuma linha adicionada.</td></tr>
                ) : (
                  group.lines.map(line => (
                    <tr key={line.line_id}>
                      <td>
                        <input
                          type="number"
                          value={line.number_row}
                          onChange={e =>
                            handleLineChange(elementId, line.line_id, 'number_row', e.target.value)
                          }
                          readOnly={!editable}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={line.colour_id}
                          onChange={e =>
                            handleLineChange(elementId, line.line_id, 'colour_id', e.target.value)
                          }
                          readOnly={!editable}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={line.stich_sequence}
                          onChange={e =>
                            handleLineChange(elementId, line.line_id, 'stich_sequence', e.target.value)
                          }
                          readOnly={!editable}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={line.observation}
                          onChange={e =>
                            handleLineChange(elementId, line.line_id, 'observation', e.target.value)
                          }
                          readOnly={!editable}
                        />
                      </td>
                      {editable && (
                        <td>
                          <button onClick={() => deleteLine(elementId, line.line_id)}>Excluir</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {editable && (
              <button onClick={() => addLine(elementId)}>Adicionar Linha</button>
            )}
            <br /><br /><br />
          </div>
        ))}
    </div>
  );
});

export default Stitchbook;
