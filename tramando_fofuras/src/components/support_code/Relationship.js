// Relationship.js (componente que obtém os dados)
import React, { useEffect, useState } from 'react';
import * as API from './API';
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

  // Passa os dados filtrados para o AmigurumiCards que vai renderizar os cards
  return (
    <div id="receita_relacionada">
        <h2>Receitas Relacionadas</h2>
        <AmigurumiCards filteredData={relatedAmigurumis}trigger={trigger} editable={editable}redirection={true}/>

    </div>
  );
}
