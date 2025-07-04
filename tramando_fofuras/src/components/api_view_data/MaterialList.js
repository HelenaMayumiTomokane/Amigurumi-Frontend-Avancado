import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as API from '../api/Material_API';
import ConfirmBox from '../support_code/ConfirmBox';

const MaterialList = forwardRef(({ amigurumiId, editable = false, trigger }, ref) => {
  const [originalList, setOriginalList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedListId, setSelectedListId] = useState('1');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    async function fetchMaterials() {
      if (!amigurumiId) return;
      setError(null);

      try {
        const data = await API.APIGet_MaterialList();
        const materials = data.filter(
          row => parseInt(row.amigurumi_id) === parseInt(amigurumiId)
        );
        setOriginalList(materials);
        setMaterialList(materials);

        if (materials.length > 0) {
          setSelectedListId(String(materials[0].list_id));
        } else {
          setSelectedListId('');
        }
      } catch (err) {
        setError('Erro ao buscar materiais');
      }
    }

    fetchMaterials();
  }, [amigurumiId, trigger]);

  function handleInputChange(index, field, value) {
    const updatedList = [...materialList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value,
    };
    setMaterialList(updatedList);
  }

  function createNewList() {
    const availableListIds = Array.from(
      new Set(materialList.map(mat => Number(mat.list_id)))
    );
    const maxId = availableListIds.length > 0 ? Math.max(...availableListIds) : 0;
    const newListId = (maxId + 1).toString();

    const newRow = {
      amigurumi_id: amigurumiId,
      material_name: '',
      quantity: '',
      colour_id: '',
      list_id: newListId,
    };

    setMaterialList(prevList => [...prevList, newRow]);
    setSelectedListId(newListId);
  }

  function addNewLine() {
    if (!selectedListId) return;

    const newRow = {
      amigurumi_id: amigurumiId,
      material_name: '',
      quantity: '',
      colour_id: '',
      list_id: selectedListId,
    };

    setMaterialList(prevList => [...prevList, newRow]);
  }

  function deleteRow(index) {
    const updatedList = [...materialList];
    updatedList.splice(index, 1);
    setMaterialList(updatedList);
  }

  function deleteList() {
    if (!selectedListId) return;

    const updatedList = materialList.filter(mat => String(mat.list_id) !== String(selectedListId));
    setMaterialList(updatedList);

    const availableListIdsAfterDelete = Array.from(new Set(updatedList.map(m => String(m.list_id)))).sort();
    setSelectedListId(availableListIdsAfterDelete[0] || '');
  }

  useImperativeHandle(ref, () => ({
    getOriginalList: () => originalList,
    getCurrentList: () => materialList,
    updateOriginalList: () => setOriginalList(materialList),
  }));

  const availableListIds = Array.from(
    new Set(materialList.map(mat => String(mat.list_id)))
  ).sort();

  const filteredMaterials = materialList.filter(
    mat => String(mat.list_id) === String(selectedListId)
  );

  return (
    <div id="group_table_list_material_backgroud">
      <div id="group_table_list_material">
        {error && <p>{error}</p>}

        <div id="group_lista_suspensa_material">
          <h2>Materiais</h2>
          <strong>Lista: </strong>
          <select
            id="lista_suspensa_material"
            value={selectedListId}
            onChange={e => setSelectedListId(e.target.value)}
          >
            {availableListIds.length > 0 ? (
              availableListIds.map(listId => (
                <option key={listId} value={listId}>
                  Lista {listId}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Nenhuma lista disponível
              </option>
            )}
          </select>

          {editable && (
            <>
              <button onClick={createNewList}>Nova Lista</button>
              <button
                onClick={() => setConfirmAction(() => deleteList)}
                disabled={!selectedListId}
                title="Excluir lista selecionada"
              >
                Excluir Lista
              </button>
            </>
          )}
        </div>

        <br />

        <table id="table_amigurumi_material">
          <thead>
            <tr>
              <th>Material</th>
              <th>Qtde</th>
              <th>ID Cor</th>
              {editable && <th>Excluir</th>}
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat, idx) => {
                const globalIndex = materialList.findIndex(item => item === mat);
                return (
                  <tr key={globalIndex}>
                    <td>
                      <input
                        type="text"
                        value={mat.material_name || ''}
                        onChange={e =>
                          handleInputChange(globalIndex, 'material_name', e.target.value)
                        }
                        readOnly={!editable}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={mat.quantity || ''}
                        onChange={e =>
                          handleInputChange(globalIndex, 'quantity', e.target.value)
                        }
                        readOnly={!editable}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={mat.colour_id || ''}
                        onChange={e =>
                          handleInputChange(globalIndex, 'colour_id', e.target.value)
                        }
                        readOnly={!editable}
                      />
                    </td>
                    {editable && (
                      <td>
                        <button onClick={() => setConfirmAction(() => () => deleteRow(globalIndex))}>
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={editable ? 4 : 3}>Nenhum material nessa lista.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Mostrar botão apenas se houver lista */}
        {editable && selectedListId && (
          <button onClick={addNewLine}>Adicionar Linha</button>
        )}

        {confirmAction && (
          <ConfirmBox
            mensagem="Tem certeza que deseja excluir?"
            onConfirmar={() => {
              confirmAction();
              setConfirmAction(null);
            }}
            onCancelar={() => setConfirmAction(null)}
          />
        )}
      </div>
    </div>
  );
});

export default MaterialList;
