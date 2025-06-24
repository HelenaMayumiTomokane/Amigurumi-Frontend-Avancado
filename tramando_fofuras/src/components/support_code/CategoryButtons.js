import React, { useEffect, useState } from "react";
import { APIGet_FoundationList } from "./API";

export default function CategoryButtons({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    APIGet_FoundationList().then((data) => {
      const uniqueCategories = [...new Set(data.map((item) => item.category))];
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
      onFilterChange({ type: "favorites", value: favoriteIds.length ? favoriteIds : [] });
    } else if (filter === "Mais Recentes") {
      onFilterChange({ type: "recent", value: null });
    } else {
      onFilterChange({ type: "category", value: filter });
    }
  }

  const capitalizeAll = (text) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const iconMap = {
    Todos: "🧸",
    Favoritos: "❤️",
    "Mais Recentes": "🕒",
    terrestre: "🐾",
    aquático: "🐠",
    boneca: "👸",
    roupa: "👗",
    cabelo: "💇‍♀️",
    acessório: "🎀",
    outros: "🧩",
  };

  const renderButton = (label) => (
    <button
      key={label}
      onClick={() => handleClick(label)}
      className={`category-button ${activeFilter === label ? "active" : ""}`}
    >
      <div className="circle">{iconMap[label] || "🔘"}</div>
      <span className="label">{capitalizeAll(label)}</span>
    </button>
  );

  return (
    <div className="category-buttons-container">
      {renderButton("Todos")}
      {renderButton("Favoritos")}
      {renderButton("Mais Recentes")}
      {categories.map((cat) => renderButton(cat))}
    </div>
  );
}
