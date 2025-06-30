import * as API from '../api/Foundation_API';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '../support_code/ConfirmBox';
import { useState } from 'react';

export async function saveFoundationChanges(originalList, currentList) {
  const updated = [];

  const originalById = Object.fromEntries(
    originalList.map(item => [item.amigurumi_id, item])
  );

  const currentById = Object.fromEntries(
    currentList.filter(item => item.amigurumi_id != null).map(item => [item.amigurumi_id, item])
  );

  for (const id in currentById) {
    if (id in originalById) {
      const original = originalById[id];
      const current = currentById[id];

      const hasChanged = ['name', 'autor', 'size', 'link', 'relationship', 'date','category'].some(
        key => original[key] !== current[key]
      );

      if (hasChanged) {
        updated.push(current);
      }
    }
  }

  const updatedResults = [];
  for (const item of updated) {
    const res = await API.APIPut_FoundationList(
      item.amigurumi_id,
      item.name,
      item.autor,
      item.size,
      item.link,
      item.relationship,
      item.date,
      item.category
    );
    updatedResults.push(res);
  }

  return {
    updated: updatedResults
  };
}







export default function BotaoNovoAmigurumi() {
  const navigate = useNavigate();
  const handleNovoAmigurumi = async () => {
    try {
      const novo = await API.APIPost_FoundationList(
        'Novo Amigurumi',
        '-',
        0,
        '-',
        '',
      );

      if (novo?.amigurumi_id) {
        navigate(`/receita?amigurumi_id=${novo.amigurumi_id}`); 
      } else {
        alert('Erro ao criar o novo amigurumi.');
      }
    } catch (error) {
      console.error('Erro ao criar amigurumi:', error);
      alert('Erro ao criar amigurumi.');
    }
  };

  return (
    <button onClick={handleNovoAmigurumi} id="button_novo_amigurumi" >Novo Amigurumi</button>
  );
}





export function BotaoDeleteAmigurumi({ amigurumiId, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  const handleDeletar = async () => {
    if (!amigurumiId) {
      setMessage('Nenhum amigurumi selecionado para deletar.');
      setShowMessageBox(true);
      return;
    }

    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.APIDelete_FoundationList(amigurumiId);
      setMessage('Amigurumi excluído com sucesso!');
      setShowMessageBox(true);
      if (typeof onDeleted === 'function') onDeleted();
    } catch (error) {
      console.error('Erro ao deletar amigurumi:', error);
      setMessage('Erro ao deletar amigurumi.');
      setShowMessageBox(true);
    } finally {
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button onClick={handleDeletar}>
        Excluir Amigurumi
      </button>

      {showConfirm && (
        <ConfirmBox
          mensagem="Deseja realmente excluir este amigurumi?"
          onConfirmar={confirmDelete}
          onCancelar={cancelDelete}
        />
      )}

      {showMessageBox && (
        <div className="simple-message-box-container">
          <div className="simple-message-box">
            <p>{message}</p>
            <button onClick={() => setShowMessageBox(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
