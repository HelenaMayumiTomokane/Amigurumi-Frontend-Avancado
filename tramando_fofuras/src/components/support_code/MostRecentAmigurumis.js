import React, { useEffect, useState } from 'react';
import * as API from './API'; // seu módulo para chamadas API
import AmigurumiCards from './AmigurumiCards';

export default function MostRecentAmigurumis({  trigger }) {
  const [recentAmigurumis, setRecentAmigurumis] = useState([]);

  useEffect(() => {
    API.APIGet_FoundationList()
      .then(data => {
        // Ordena do mais recente para o mais antigo pela data
        const sorted = data
          .filter(item => item.date && isNaN(parseInt(item.relationship)))  // garante que tem data
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Pega os dois primeiros
        const topTwo = sorted.slice(0, 2);

        setRecentAmigurumis(topTwo);
      })
      .catch(err => {
        console.error('Erro ao carregar amigurumis:', err);
      });
  }, [trigger]);

  return (
    <div>
      <h2>Amigurumis Mais Recentes</h2>
      <AmigurumiCards filteredData={recentAmigurumis} trigger={trigger} editable={false} redirection={true}
      />
    </div>
  );
}
