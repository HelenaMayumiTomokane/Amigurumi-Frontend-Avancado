import React, { useEffect, useState } from 'react';
import * as API from './API';

export default function SaveImageChanges({ amigurumiId, onClose, onSaved }) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      const all = await API.APIGet_Image();
      const filtered = all.filter(img => parseInt(img.amigurumi_id) === parseInt(amigurumiId));
      setImages(filtered);
    }
    fetchImages();
  }, [amigurumiId]);

  const handleUpload = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      await API.APIPost_Image(false, amigurumiId, 1, base64); // list_id fixo como 1
      onSaved();
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (imageId) => {
    await API.APIDelete_Image(imageId);
    onSaved();
  };

  const handleSetMain = async (imageId) => {
    const img = images.find(i => i.image_id === imageId);
    if (!img) return;
    await API.APIPut_Image(imageId, true, amigurumiId, img.list_id, img.image_base64);
    onSaved();
  };

  return (
    <div className="modal">
      <h3>Gerenciar Imagens do Amigurumi {amigurumiId}</h3>
      {images.map(img => (
        <div key={img.image_id}>
          <img
            src={`data:image/jpeg;base64,${img.image_base64}`}
            alt="img"
            width="100"
            style={{ border: img.main_image ? '3px solid green' : '1px solid gray' }}
          />
          <button onClick={() => handleDelete(img.image_id)}>Excluir</button>
          {!img.main_image && (
            <button onClick={() => handleSetMain(img.image_id)}>Definir como Principal</button>
          )}
        </div>
      ))}

      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Adicionar Imagem</button>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}
