// saveFoundationChanges.js
import * as API from './API';

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
  const handleNovoAmigurumi = async () => {
    try {
      const novo = await API.APIPost_FoundationList(
        'Novo Amigurumi', // nome vazio
        '-', // autor vazio
        0, // tamanho vazio
        '-', // link vazio
        '', // relacionamento vazio
      );

      // Redireciona para a página com o novo ID
      if (novo?.amigurumi_id) {
        window.location.href = `/receita?id=${novo.amigurumi_id}`;
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
  const handleDeletar = async () => {
    if (!amigurumiId) {
      alert('Nenhum amigurumi selecionado para deletar.');
      return;
    }

    if (!window.confirm('Deseja realmente excluir este amigurumi?')) {
      return;
    }

    try {
      const res = await API.APIDelete_FoundationList(amigurumiId);

      alert('Amigurumi excluído com sucesso!');

      // Callback para o componente pai atualizar a interface
      if (typeof onDeleted === 'function') {
        onDeleted();
      }
    } catch (error) {
      console.error('Erro ao deletar amigurumi:', error);
      alert('Erro ao deletar amigurumi.');
    }
  };

  return (
    <button onClick={handleDeletar}>
      Excluir Amigurumi Atual
    </button>
  );
}
