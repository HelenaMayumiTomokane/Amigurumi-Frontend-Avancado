import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import * as API from '../api/Stitchbook_API';
import ConfirmBox from "../support_code/ConfirmBox";

let nextElementId = -1;
let nextLineId = -1;

const Stitchbook = forwardRef(({ amigurumiId, editable = false, trigger }, ref) => {
  const [originalData, setOriginalData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmacao, setConfirmacao] = useState(null);

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

  const removeElement = (element_id) => {
    setEditData(old => old.filter(el => el.element_id !== element_id));
    setConfirmacao(null);
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
    setConfirmacao(null);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div id="div_stitchbookList">
      {editable && <button onClick={addElement}>+ Adicionar Tabela (Elemento)</button>}
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
                <th>Carreira</th>
                <th>Cor</th>
                <th>Pontos</th>
                <th>Observação</th>
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
                      type="number"
                      value={line.colour_id}
                      onChange={(e) => updateLine(el.element_id, line.line_id, "colour_id", parseInt(e.target.value))}
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

                  {editable && (
                    <td>
                      <button
                        onClick={() =>
                          setConfirmacao({
                            tipo: 'linha',
                            element_id: el.element_id,
                            line_id: line.line_id
                          })
                        }
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
            <>
              <button onClick={() => addLine(el.element_id)}>Adicionar Linha</button>
              <button
                onClick={() =>
                  setConfirmacao({
                    tipo: 'tabela',
                    element_id: el.element_id
                  })
                }
              >
                Excluir Tabela
              </button>
            </>
          )}
          <br /><br /><br />
        </div>
      ))}

      {confirmacao && (
        <ConfirmBox
          mensagem={
            confirmacao.tipo === 'linha'
              ? 'Deseja realmente excluir esta linha?'
              : 'Deseja realmente excluir esta tabela?'
          }
          onConfirmar={() =>
            confirmacao.tipo === 'linha'
              ? removeLine(confirmacao.element_id, confirmacao.line_id)
              : removeElement(confirmacao.element_id)
          }
          onCancelar={() => setConfirmacao(null)}
        />
      )}
    </div>
  );
});

export default Stitchbook;
