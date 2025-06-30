import { useState, useEffect } from "react";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import * as API from "../../components/api/Foundation_API";

import AmigurumiCards from "../../components/amigurumi_cards/AmigurumiCards";

import CategoryButtons from "../../components/support_code/CategoryButtons";
import SearchBar from "../../components/support_code/Searchbar";

import "./Home.css";

export default function AmigurumiPrincipal() {
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const foundationData = await API.APIGet_FoundationList();
        setAmigurumis(foundationData);
        setFilteredAmigurumis(foundationData);
      } catch (error) {
        console.error("Erro ao carregar amigurumis:", error);
      }
    }

    fetchData();

    const storedFavorites = localStorage.getItem("favoriteAmigurumis");
    setFavoriteIds(storedFavorites ? JSON.parse(storedFavorites) : []);

    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role || null);
    }
  }, [trigger]);

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
