import { useEffect, useState } from 'react';
import * as API from '../api/Foundation_API';
import AmigurumiCards from './AmigurumiCards';

export default function MostRecentAmigurumis({  trigger }) {
  const [recentAmigurumis, setRecentAmigurumis] = useState([]);

  useEffect(() => {
    API.APIGet_FoundationList()
      .then(data => {
        const sorted = data
          .filter(item => item.date && isNaN(parseInt(item.relationship)))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

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
