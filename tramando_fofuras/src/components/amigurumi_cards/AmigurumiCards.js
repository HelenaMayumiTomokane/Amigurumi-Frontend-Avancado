import { useEffect, useState } from 'react';
import * as API from '../api/ImageAmigurumi_API';
import { useNavigate } from 'react-router-dom';

export default function AmigurumiCards({ filteredData, trigger, setTrigger, editable, redirection }) {
  const navigate = useNavigate();
  const [imagesMap, setImagesMap] = useState({});
  const [currentIndexMap, setCurrentIndexMap] = useState({});

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
              aria-label={favorites.includes(amig.amigurumi_id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
                <button
                  aria-label="Imagem anterior"
                  className="next_previous"
                  onClick={() =>
                    setCurrentIndexMap(prev => ({
                      ...prev,
                      [amig.amigurumi_id]: (idx - 1 + imgs.length) % imgs.length
                    }))
                  }
                >
                  {'<'}
                </button>
                <span>{idx + 1} / {imgs.length}</span>
                <button
                  aria-label="Próxima imagem"
                  className="next_previous"
                  onClick={() =>
                    setCurrentIndexMap(prev => ({
                      ...prev,
                      [amig.amigurumi_id]: (idx + 1) % imgs.length
                    }))
                  }
                >
                  {'>'}
                </button>
              </div>
            )}

            {redirection && (
              <button
                className="dark_button"
                onClick={() => navigate(`/receita?amigurumi_id=${amig.amigurumi_id}`)} 
              >
                Ver Mais
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
