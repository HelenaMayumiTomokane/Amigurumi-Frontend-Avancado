import { useEffect, useState } from 'react';
import * as API from '../api/Foundation_API';
import AmigurumiCards from './AmigurumiCards';

export default function Relationship({ amigurumiId, editable, trigger }) {
  const [relatedAmigurumis, setRelatedAmigurumis] = useState([]);

  useEffect(() => {
    if (!amigurumiId) return;

    API.APIGet_FoundationList()
      .then(data => {
        const related = data.filter(
          item => parseInt(item.relationship) === parseInt(amigurumiId)
        );
        setRelatedAmigurumis(related);
      })
      .catch(err => {
        console.error('Erro ao carregar amigurumis relacionados:', err);
      });
  }, [amigurumiId, trigger]);

  return (
    <div id="receita_relacionada">
        <h2>Receitas Relacionadas</h2>
        <AmigurumiCards filteredData={relatedAmigurumis}trigger={trigger} editable={editable}redirection={true}/>

    </div>
  );
}
