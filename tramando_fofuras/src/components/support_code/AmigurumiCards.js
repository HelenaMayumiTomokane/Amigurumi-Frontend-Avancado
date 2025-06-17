import React, { useEffect, useState } from 'react';
import * as API from './API';

export default function AmigurumiCards({ filteredData, trigger, setTrigger, editable, redirection }) {
  const [imagesMap, setImagesMap] = useState({});
  const [currentIndexMap, setCurrentIndexMap] = useState({});
  const [showModalFor, setShowModalFor] = useState(null);

  // Favoritos
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favoriteAmigurumis');
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (amigurumiId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(amigurumiId);
      const updated = isFavorite
        ? prev.filter(id => id !== amigurumiId)
        : [...prev, amigurumiId];
      localStorage.setItem('favoriteAmigurumis', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    async function fetchImages() {
      if (!filteredData || filteredData.length === 0) return;

      const allImages = await API.APIGet_Image();
      const map = {};
      const indexMap = {};

      filteredData.forEach(amig => {
        const imgs = allImages
          .filter(img => parseInt(img.amigurumi_id) === parseInt(amig.amigurumi_id))
          .sort((a, b) => b.main_image - a.main_image);
        map[amig.amigurumi_id] = imgs;
        indexMap[amig.amigurumi_id] = 0;
      });

      setImagesMap(map);
      setCurrentIndexMap(indexMap);
    }

    fetchImages();
  }, [filteredData, trigger]);

  if (!filteredData || filteredData.length === 0) {
    return <p>Não foi encontrado nenhum amigurumi</p>;
  }

  return (
    <div className="card_conterner">
      {filteredData.map(amig => {
        const imgs = imagesMap[amig.amigurumi_id] || [];
        const idx = currentIndexMap[amig.amigurumi_id] || 0;
        const current = imgs[idx];

        return (
          <div key={amig.amigurumi_id} className="cardAmigurumi">
            {/* Ícone de favorito */}
            <button
              className={`favorite-button ${favorites.includes(amig.amigurumi_id) ? 'favorited' : ''}`}
              onClick={() => toggleFavorite(amig.amigurumi_id)}
            >
              {favorites.includes(amig.amigurumi_id) ? '❤️' : '♡'}
            </button>

            <h3>{amig.name}</h3>
            {current ? (
              <img
                src={`data:image/jpeg;base64,${current.image_base64}`}
                alt={amig.name}
                className="image_Amigurumi"
              />
            ) : (
              <p>Sem imagem</p>
            )}

            {imgs.length > 1 && (
              <div className="container_next_previous">
                <button className="next_previous" onClick={() =>
                  setCurrentIndexMap(prev => ({
                    ...prev,
                    [amig.amigurumi_id]: (idx - 1 + imgs.length) % imgs.length
                  }))
                }>{'<'}</button>
                <span>{idx + 1} / {imgs.length}</span>
                <button className="next_previous" onClick={() =>
                  setCurrentIndexMap(prev => ({
                    ...prev,
                    [amig.amigurumi_id]: (idx + 1) % imgs.length
                  }))
                }>{'>'}</button>
              </div>
            )}

            {editable && (
              <button onClick={() => setShowModalFor(amig.amigurumi_id)}>Gerenciar Imagens</button>
            )}

            {redirection && (
              <button className="see_more" onClick={() => window.location.href = `/receita?id=${amig.amigurumi_id}`}>
                Ver Mais
              </button>
            )}
          </div>
        );
      })}

      {showModalFor && (
        <ImageManagerModal
          amigurumiId={showModalFor}
          onClose={() => setShowModalFor(null)}
          onSaved={() => {
            setShowModalFor(null);
            setTrigger(t => !t);
          }}
        />
      )}
    </div>
  );
}

export function ImageManagerModal({ amigurumiId, onClose, onSaved }) {
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
