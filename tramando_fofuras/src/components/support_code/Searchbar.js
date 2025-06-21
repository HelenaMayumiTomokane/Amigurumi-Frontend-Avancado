import React from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, amigurumis, setFilteredAmigurumis }) {
  function handleSearch() {
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
    <section>
      <input
        id="searchInput"
        type="text"
        placeholder="Pesquisar amigurumi..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '250px', marginRight: '0.5rem' }}
      />
      <button onClick={handleSearch} id="botton_search">Pesquisar</button>
    </section>
  );
}
