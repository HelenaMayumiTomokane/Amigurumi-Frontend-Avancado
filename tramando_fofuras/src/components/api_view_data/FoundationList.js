import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as API from '../api/Foundation_API';

const FoundationList = forwardRef(({ amigurumiId, editable = false, trigger = null }, ref) => {
  const [originalList, setOriginalList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!amigurumiId) return;

    API.APIGet_FoundationList()
      .then(data => {
        const filtered = data.filter(
          row => parseInt(row.amigurumi_id) === parseInt(amigurumiId)
        );
        setOriginalList(filtered);
        setCurrentList(filtered);
      })
      .catch(err => {
        console.error('Erro ao carregar a lista de amigurumis:', err);
        setError('Erro ao carregar dados');
      });
  }, [trigger, amigurumiId]);

  const handleInputChange = (index, field, value) => {
    const updated = [...currentList];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentList(updated);
  };

  useImperativeHandle(ref, () => ({
    getOriginalList: () => originalList,
    getCurrentList: () => currentList,
    updateOriginalList: () => setOriginalList(currentList)
  }));

  if (error) return <p>{error}</p>;

  return (
    <div id ="amigurumi_information">
      {currentList.map((item, index) => (
        <div key={item.amigurumi_id}>
        <input
          type="text"
          value={item.name || ''}
          onChange={e => handleInputChange(index, 'name', e.target.value)}
          readOnly={!editable}
          className="input_name"
          placeholder="Nome"
        />

        <br /><br />
        <div className="input-grid">
          <div className="input-item">
            <strong>Tamanho (cm):</strong>
            <input
              type="number"
              value={item.size || ''}
              onChange={e => handleInputChange(index, 'size', e.target.value)}
              readOnly={!editable}
            />
          </div>

          <div className="input-item">
            <strong>Relacionamento:</strong>
            <input
              type="number"
              min="0"
              step="1"
              value={item.relationship ?? ''}
              onChange={e => {
                const value = e.target.value;
                handleInputChange(index, 'relationship', value === '' ? null : parseInt(value));
              }}
              readOnly={!editable}
            />
          </div>

          <div className="input-item">
            <strong>Categoria:</strong>
            <input
              type="text"
              value={item.category ?? ''}
              onChange={e => handleInputChange(index, 'category', e.target.value)}
              readOnly={!editable}
            />
          </div>

          <div className="input-item">
            <strong>Data de Criação:</strong>
            <input
              type="date"
              value={item.date ? item.date.slice(0, 10) : ''}
              onChange={e => handleInputChange(index, 'date', e.target.value)}
              readOnly={!editable}
            />
          </div>

          <div className="input-item">
            <strong>Autor:</strong>
            <input
              type="text"
              value={item.autor || ''}
              onChange={e => handleInputChange(index, 'autor', e.target.value)}
              readOnly={!editable}
            />
          </div>

          <div className="input-item">
            <strong>Link:</strong>
            <input
              type="text"
              value={item.link || ''}
              onChange={e => handleInputChange(index, 'link', e.target.value)}
              readOnly={!editable}
            />
          </div>

          
        </div>


        </div>
      ))}
    </div>
  );
});

export default FoundationList;
