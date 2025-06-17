import React from 'react';


export default function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  return (
    <section>
      <input id="searchInput"
        type="text"
        placeholder="Pesquisar amigurumi..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '250px', marginRight: '0.5rem' }}
      />
      <button onClick={onSearch} id="botton_search">Pesquisar</button>
    </section>
  );
}
