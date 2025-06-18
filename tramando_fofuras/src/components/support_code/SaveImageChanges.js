import React, { useEffect, useState } from 'react';
import * as API from './API';

export default function SaveImageChanges({ amigurumiId, onClose }) {
  const [imageList, setImageList] = useState([]);
  const [newImage, setNewImage] = useState({
    main_image: false,
    list_id: '',
    image_base64: ''
  });
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    API.APIGet_Image().then(data => {
      const filtered = data.filter(img => img.amigurumi_id === amigurumiId);
      // Adiciona cópia da imagem original para comparação futura
      const enriched = filtered.map(img => ({
        ...img,
        original: { ...img }, // guardamos os dados originais
        wasEdited: false
      }));
      setImageList(enriched);
    });
  }, [amigurumiId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      setNewImage(prev => ({ ...prev, image_base64: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      const updatedList = [...imageList];
      updatedList[index].image_base64 = base64Data;
      updatedList[index].wasEdited = true;
      setImageList(updatedList);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir esta imagem?')) {
      setDeletedIds(prev => [...prev, id]);
      setImageList(prev => prev.filter(img => img.image_id !== id));
    }
  };

  const handleAddNewImage = () => {
    if (!newImage.image_base64 || !newImage.list_id) {
      alert('Preencha a lista e selecione uma imagem');
      return;
    }
    const tempId = -(imageList.length + 1);
    setImageList(prev => [
      ...prev,
      {
        ...newImage,
        image_id: tempId,
        amigurumi_id: amigurumiId
      }
    ]);
    setNewImage({ main_image: false, list_id: '', image_base64: '' });
  };

  const handleChange = (index, field, value) => {
    const updated = [...imageList];
    updated[index][field] = value;
    updated[index].wasEdited = true;
    setImageList(updated);
  };

  const handleSaveAll = async () => {
    for (const id of deletedIds) {
      await API.APIDelete_Image(id);
    }

    const newImages = imageList.filter(img => img.image_id < 0);
    for (const img of newImages) {
      await API.APIPost_Image(img.main_image, amigurumiId, img.list_id, img.image_base64);
    }

    const updatedImages = imageList.filter(img => img.image_id > 0 && img.wasEdited);
    for (const img of updatedImages) {
      await API.APIPut_Image(img.image_id, img.main_image, amigurumiId, img.list_id, img.image_base64);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Gerenciar Imagens</h2>

        <h4>Nova Imagem</h4>
        <label>
          <input
            type="checkbox"
            checked={newImage.main_image}
            onChange={e =>
              setNewImage(prev => ({ ...prev, main_image: e.target.checked }))
            }
          />{' '}
          Principal
        </label>
        <input
          type="text"
          placeholder="List ID"
          value={newImage.list_id}
          onChange={e =>
            setNewImage(prev => ({ ...prev, list_id: e.target.value }))
          }
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {newImage.image_base64 && (
          <img
            src={`data:image/png;base64,${newImage.image_base64}`}
            alt="Preview nova imagem"
            className="image-preview"
          />
        )}
        <button onClick={handleAddNewImage}>Adicionar</button>

        <h4>Imagens Existentes</h4>
        {imageList.map((img, index) => (
          <div key={img.image_id} className="image-box">
            <img
              src={`data:image/png;base64,${img.image_base64}`}
              alt="Imagem existente"
              className="image-preview"
            />
            <label>
              <input
                type="checkbox"
                checked={img.main_image}
                onChange={e => handleChange(index, 'main_image', e.target.checked)}
              />{' '}
              Principal
            </label>
            <input
              type="text"
              value={img.list_id}
              onChange={e => handleChange(index, 'list_id', e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => handleEditFileChange(e, index)}
            />
            <button onClick={() => handleDelete(img.image_id)}>Excluir</button>
          </div>
        ))}

        <button onClick={handleSaveAll}>Salvar alterações e Fechar</button>
      </div>
    </div>
  );
}
