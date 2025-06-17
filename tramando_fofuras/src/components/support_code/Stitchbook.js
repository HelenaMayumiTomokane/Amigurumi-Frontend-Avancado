import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import * as API from './API';

let nextElementId = -1;
let nextLineId = -1;

const Stitchbook = forwardRef(({ amigurumiId, editable = false, trigger }, ref) => {
  const [originalData, setOriginalData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!amigurumiId) return;

    setLoading(true);
    API.APIGet_Stitchbook()
      .then((data) => {
        const filtered = data.filter((el) => el.amigurumi_id === amigurumiId);
        setOriginalData(filtered);
        setEditData(JSON.parse(JSON.stringify(filtered)));
      })
      .finally(() => setLoading(false));
  }, [amigurumiId, trigger]);

  useImperativeHandle(ref, () => ({
    getOriginalList: () => originalData,
    getCurrentList: () => editData
  }));

  const updateElement = (element_id, field, value) => {
    setEditData(old =>
      old.map(el => el.element_id === element_id ? { ...el, [field]: value } : el)
    );
  };

  const updateLine = (element_id, line_id, field, value) => {
    setEditData(old =>
      old.map(el =>
        el.element_id === element_id
          ? {
              ...el,
              lines: el.lines.map(line =>
                line.line_id === line_id ? { ...line, [field]: value } : line
              )
            }
          : el
      )
    );
  };

  const addElement = () => {
    setEditData(old => [
      ...old,
      {
        amigurumi_id: amigurumiId,
        element_id: nextElementId--,
        element_name: "",
        element_order: 0,
        repetition: 1,
        lines: []
      }
    ]);
  };

  const removeElement = (element_id) => {
    setEditData(old => old.filter(el => el.element_id !== element_id));
  };

  const addLine = (element_id) => {
    setEditData(old =>
      old.map(el =>
        el.element_id === element_id
          ? {
              ...el,
              lines: [
                ...el.lines,
                {
                  line_id: nextLineId--,
                  number_row: 1,
                  stich_sequence: "",
                  observation: "",
                  colour_id: 0
                }
              ]
            }
          : el
      )
    );
  };

  const removeLine = (element_id, line_id) => {
    setEditData(old =>
      old.map(el =>
        el.element_id === element_id
          ? {
              ...el,
              lines: el.lines.filter(line => line.line_id !== line_id)
            }
          : el
      )
    );
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div id="div_stitchbookList">
      <h2>Stitchbook</h2>
      {editable && (
        <button onClick={addElement}>+ Adicionar Tabela (Elemento)</button>
      )}
      <br /><br />

      {editData.map(el => (
        <div key={el.element_id}>
          <table id="stitchbook_sequence_data">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ordem</th>
                <th>Repetição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    value={el.element_name}
                    onChange={(e) => updateElement(el.element_id, "element_name", e.target.value)}
                    disabled={!editable}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={el.element_order}
                    onChange={(e) => updateElement(el.element_id, "element_order", parseInt(e.target.value))}
                    disabled={!editable}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={el.repetition}
                    onChange={(e) => updateElement(el.element_id, "repetition", parseInt(e.target.value))}
                    disabled={!editable}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <br />
          <table id="stitchbook_table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Sequência</th>
                <th>Observação</th>
                <th>Cor</th>
                {editable && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {el.lines.map(line => (
                <tr key={line.line_id}>
                  <td>
                    <input
                      type="number"
                      value={line.number_row}
                      onChange={(e) => updateLine(el.element_id, line.line_id, "number_row", parseInt(e.target.value))}
                      disabled={!editable}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={line.stich_sequence}
                      onChange={(e) => updateLine(el.element_id, line.line_id, "stich_sequence", e.target.value)}
                      disabled={!editable}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={line.observation}
                      onChange={(e) => updateLine(el.element_id, line.line_id, "observation", e.target.value)}
                      disabled={!editable}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={line.colour_id}
                      onChange={(e) => updateLine(el.element_id, line.line_id, "colour_id", parseInt(e.target.value))}
                      disabled={!editable}
                    />
                  </td>
                  {editable && (
                    <td>
                      <button
                        onClick={() => {
                          const confirmed = window.confirm("Tem certeza que deseja excluir esta linha?");
                          if (confirmed) {
                            removeLine(el.element_id, line.line_id);
                          }
                        }}
                      >
                        Excluir Linha
                      </button>

                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {editable && (
            <button onClick={() => addLine(el.element_id)}> Adicionar Linha</button>
          )}

          {editable && (
            <button
              onClick={() => {
                const confirmed = window.confirm("Tem certeza que deseja excluir esta tabela?");
                if (confirmed) {
                  removeElement(el.element_id);
                }
              }}
            >Excluir Tabela</button>

          )}
          <br></br>
          <br></br>
          <br></br>
        </div>
      ))}
    </div>
  );
});

export default Stitchbook;
