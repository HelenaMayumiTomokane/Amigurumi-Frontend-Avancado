import React, { useEffect, useState } from "react";
import { APIGet_FoundationList } from "./API";

export default function CategoryButtons({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Todos"); // pode ser 'Todos', 'Favoritos', 'Mais Recentes' ou categoria
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    APIGet_FoundationList().then((data) => {
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    });

    const stored = localStorage.getItem("favoriteAmigurumis");
    setFavoriteIds(stored ? JSON.parse(stored) : []);
  }, []);

  function handleClick(filter) {
    setActiveFilter(filter);

    if (filter === "Todos") {
      onFilterChange({ type: "all", value: null });
    } else if (filter === "Favoritos") {
      onFilterChange({ type: "favorites", value: favoriteIds });
    } else if (filter === "Mais Recentes") {
      onFilterChange({ type: "recent", value: null });
    } else {
      onFilterChange({ type: "category", value: filter });
    }
  }

  return (
    <div className="category-buttons-container">
      <button
        key="Todos"
        onClick={() => handleClick("Todos")}
        className={activeFilter === "Todos" ? "active" : ""}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={activeFilter === cat ? "active" : ""}
        >
          {cat}
        </button>
      ))}

      <button
        key="Favoritos"
        onClick={() => handleClick("Favoritos")}
        className={activeFilter === "Favoritos" ? "active" : ""}
      >
        Favoritos ❤️
      </button>

      <button
        key="Mais Recentes"
        onClick={() => handleClick("Mais Recentes")}
        className={activeFilter === "Mais Recentes" ? "active" : ""}
      >
        Mais Recentes
      </button>
    </div>
  );
}
