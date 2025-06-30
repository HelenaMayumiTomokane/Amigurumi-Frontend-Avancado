import { useEffect, useState } from 'react';
import * as API from '../api/ImageAmigurumi_API';
import ConfirmBox from '../support_code/ConfirmBox';

export default function SaveImageChanges({ amigurumiId, onClose }) {
  const [imageList, setImageList] = useState([]);
  const [newImage, setNewImage] = useState({
    main_image: false,
    list_id: '',
    image_base64: ''
  });
  const [deletedIds, setDeletedIds] = useState([]);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [imageToDeleteId, setImageToDeleteId] = useState(null);

  useEffect(() => {
    API.APIGet_Image().then(data => {
      const filtered = data.filter(img => img.amigurumi_id === amigurumiId);
      const enriched = filtered.map(img => ({
        ...img,
        original: { ...img },
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

  const handleAskDelete = (id) => {
    setImageToDeleteId(id);
    setShowConfirmBox(true);
  };

  const confirmDelete = () => {
    if (imageToDeleteId != null) {
      setDeletedIds(prev => [...prev, imageToDeleteId]);
      setImageList(prev => prev.filter(img => img.image_id !== imageToDeleteId));
      setImageToDeleteId(null);
    }
    setShowConfirmBox(false);
  };

  const cancelDelete = () => {
    setImageToDeleteId(null);
    setShowConfirmBox(false);
  };

  const handleAddNewImage = () => {
    if (!newImage.image_base64 || !newImage.list_id) {
      alert('Preencha a lista e selecione uma imagem');
      return;
    }

    const updatedList = newImage.main_image
      ? imageList.map(img => ({ ...img, main_image: false }))
      : [...imageList];

    const tempId = -(imageList.length + 1);
    updatedList.push({
      ...newImage,
      image_id: tempId,
      amigurumi_id: amigurumiId
    });

    setImageList(updatedList);
    setNewImage({ main_image: false, list_id: '', image_base64: '' });
  };

  const handleChange = (index, field, value) => {
    const updated = [...imageList];

    if (field === 'main_image' && value === true) {
      updated.forEach((img, i) => {
        updated[i].main_image = false;
      });
    }

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

        {showConfirmBox && (
          <ConfirmBox
            mensagem="Deseja realmente excluir esta imagem?"
            onConfirmar={confirmDelete}
            onCancelar={cancelDelete}
          />
        )}

        <h4>Nova Imagem</h4>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {newImage.image_base64 && (
          <img
            src={`data:image/png;base64,${newImage.image_base64}`}
            alt="Preview nova imagem"
            className="image-preview"
          />
        )}
        <label>
          <input
            type="radio"
            name="main_image"
            checked={newImage.main_image}
            onChange={() => {
              setNewImage(prev => ({ ...prev, main_image: true }));
              setImageList(prev => prev.map(img => ({ ...img, main_image: false })));
            }}
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
                type="radio"
                name="main_image"
                checked={img.main_image}
                onChange={() => handleChange(index, 'main_image', true)}
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
            <button onClick={() => handleAskDelete(img.image_id)}>Excluir</button>
          </div>
        ))}

        <button onClick={handleSaveAll}>Salvar alterações e Fechar</button>
      </div>
    </div>
  );
}
