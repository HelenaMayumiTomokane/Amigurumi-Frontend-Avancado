import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import * as API from '../../components/support_code/API';
import BotaoNovoAmigurumi from '../../components/support_code/SaveFoundationList';
import SearchBar from '../../components/support_code/Searchbar';
import AmigurumiCards from '../../components/support_code/AmigurumiCards';
import  MostRecentAmigurumis  from '../../components/support_code/MostRecentAmigurumis';
import  AmigurumiCarousel   from '../../components/support_code/AmigurumiCarousel';
import './Home.css';

export default function AmigurumiPrincipal() {
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trigger, setTrigger] = useState(false); // <- para forçar atualização

  useEffect(() => {
    async function fetchData() {
      try {
        const foundationData = await API.APIGet_FoundationList();
        const filteredData = foundationData.filter(row => !row.relationship);
        setAmigurumis(filteredData);
        setFilteredAmigurumis(filteredData);
      } catch (error) {
        console.error('Erro ao carregar amigurumis:', error);
      }
    }

    fetchData();
  }, []);

  function filterAmigurumis() {
    if (!searchQuery.trim()) {
      setFilteredAmigurumis(amigurumis);
      return;
    }

    const result = amigurumis.filter(row =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredAmigurumis(result);

    if (result.length === 0) {
      alert('Nenhum resultado encontrado. Tente outra busca ou limpe a barra de pesquisa.');
    }
  }

  return (
    <>
      <Header />
      <br></br>
      <AmigurumiCarousel />
      <div className="data_body">

        <section  id="searchbar_section">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={filterAmigurumis}/> 
        
        <BotaoNovoAmigurumi/>
        </section>

        <br></br>
        <br></br>
        {searchQuery === "" && <MostRecentAmigurumis trigger={trigger} />}
        <br></br>
        <br></br>

        <h2>Todas as Receitas</h2>
        <AmigurumiCards filteredData={filteredAmigurumis} trigger={trigger} setTrigger={setTrigger} editable={false} redirection={true}/>
        
        
      </div>
      <br></br>
      <Footer />
    </>
  );
}
