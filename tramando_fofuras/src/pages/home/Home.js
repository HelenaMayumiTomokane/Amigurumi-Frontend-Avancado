import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import * as API from "../../components/support_code/API";
import SearchBar from "../../components/support_code/Searchbar";
import AmigurumiCards from "../../components/support_code/AmigurumiCards";
import CategoryButtons from "../../components/support_code/CategoryButtons";
import "./Home.css";

export default function AmigurumiPrincipal() {
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Carrega dados e favoritos e papel do usuário
  useEffect(() => {
    async function fetchData() {
      try {
        const foundationData = await API.APIGet_FoundationList();
        setAmigurumis(foundationData);
        setFilteredAmigurumis(foundationData); // inicialmente mostra tudo
      } catch (error) {
        console.error("Erro ao carregar amigurumis:", error);
      }
    }

    fetchData();

    // Carrega favoritos do localStorage
    const storedFavorites = localStorage.getItem("favoriteAmigurumis");
    setFavoriteIds(storedFavorites ? JSON.parse(storedFavorites) : []);

    // Carrega papel do usuário do localStorage (exemplo)
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role || null);
    }
  }, [trigger]);

  // Aplica filtros (Todos, Favoritos, Mais Recentes, Categoria) + busca + filtro relationship apenas no Todos
  useEffect(() => {
    let data = amigurumis;

    if (activeFilter === "Todos") {
      data = data.filter((row) => !row.relationship);
    } else if (activeFilter === "Favoritos") {
      data = data.filter((item) => favoriteIds.includes(item.amigurumi_id));
    } else if (activeFilter === "Mais Recentes") {
      data = data
        .filter((item) => item.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);
    } else if (
      activeFilter !== "Todos" &&
      activeFilter !== "Favoritos" &&
      activeFilter !== "Mais Recentes"
    ) {
      data = data.filter((item) => item.category === activeFilter);
    }

    setFilteredAmigurumis(data);
  }, [amigurumis, activeFilter, searchQuery, favoriteIds]);

  function onFilterChange(filter) {
    if (filter.type === "all") {
      setActiveFilter("Todos");
    } else if (filter.type === "favorites") {
      setActiveFilter("Favoritos");
      setFavoriteIds(filter.value || []);
    } else if (filter.type === "recent") {
      setActiveFilter("Mais Recentes");
    } else if (filter.type === "category") {
      setActiveFilter(filter.value || "Todos");
    }
  }

  return (
    <>
      <Header />
      <br />
      <div id="div_image_id_backfront">
        <img
          src="../../assets/image/image_id_backfront.png"
          alt="Logo"
          id="image_id_backfront"
        />
      </div>

      <div className="data_body">
        <br />
        <br />
        <CategoryButtons onFilterChange={onFilterChange} />
        <br />
        <br />


        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          amigurumis={amigurumis}
          setFilteredAmigurumis={setFilteredAmigurumis}
        />



        <br />
        <br />

        <AmigurumiCards
          filteredData={filteredAmigurumis}
          trigger={trigger}
          setTrigger={setTrigger}
          editable={false}
          redirection={true}
        />
      </div>
      <br />
      <Footer />
    </>
  );
}
