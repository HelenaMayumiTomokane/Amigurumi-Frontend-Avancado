import React, { useEffect, useRef, useState } from 'react';
import * as API from './API';

export default function AmigurumiCarousel() {
  const [images, setImages] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [foundationList, allImages] = await Promise.all([
          API.APIGet_FoundationList(),
          API.APIGet_Image()
        ]);

        const validAmigurumis = foundationList
          .filter(item => item.date && isNaN(parseInt(item.relationship)))

        const validIds = validAmigurumis.map(a => parseInt(a.amigurumi_id));
        const filteredImages = allImages.filter(img =>
          validIds.includes(parseInt(img.amigurumi_id))
        );

        setImages(filteredImages);
      } catch (err) {
        console.error('Erro ao carregar dados do carrossel:', err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

    const interval = setInterval(() => {
      if (scrollAmount >= maxScrollLeft) {
        scrollAmount = 0;
        carousel.scrollLeft = 0;
      } else {
        scrollAmount += scrollStep;
        carousel.scrollLeft = scrollAmount;
      }
    }, 20);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return <p>Sem imagens disponíveis</p>;

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-track">
        {images.map((img, index) => (
          <div
            className="carousel-slide"
            key={index}
            onClick={() => window.location.href = `/receita?id=${img.amigurumi_id}`}
            style={{ cursor: 'pointer' }}
            title="Clique para ver a receita"
          >
            <img
              src={`data:image/png;base64,${img.image_base64}`}
              alt={`Imagem ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
