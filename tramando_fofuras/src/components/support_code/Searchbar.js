import { useState } from 'react';

export default function SearchBar({ searchQuery, setSearchQuery, amigurumis, setFilteredAmigurumis }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');

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
      setMessage('Nenhum resultado encontrado. Tente outra busca ou limpe a barra de pesquisa.');
      setShowMessageBox(true);
    }
  }

  function MessageBox() {
    if (!showMessageBox) return null;

    return (
      <div className="simple-message-box-container">
        <div className="simple-message-box error">
          <p>{message}</p>
          <button onClick={() => setShowMessageBox(false)}>OK</button>
        </div>
      </div>
    );
  }

  return (
    <section id="searchbar_section">
      <input
        id="searchInput"
        type="text"
        placeholder="Pesquisar amigurumi..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="dark_button">Pesquisar</button>

      <MessageBox />
    </section>
  );
}
