// Mostra só os amigurumis do usuário logado
import React, { useEffect, useState } from 'react';
import * as API from './API';
import AmigurumiCards from './AmigurumiCards';

export default function AmigurumisDoUsuario({ username, trigger }) {
  const [meusAmigurumis, setMeusAmigurumis] = useState([]);

  useEffect(() => {
    API.APIGet_FoundationList()
      .then(data => {
        const filtrados = data.filter(item => item.autor === username);
        setMeusAmigurumis(filtrados);
      })
      .catch(err => {
        console.error('Erro ao carregar amigurumis do usuário:', err);
      });
  }, [trigger, username]);

  if (!username) return null;

  return (
    <div>
      <h3>Amigurumis Criados por Você</h3>
      <AmigurumiCards
        filteredData={meusAmigurumis}
        trigger={trigger}
        editable={false}
        redirection={true}
      />
    </div>
  );
}
