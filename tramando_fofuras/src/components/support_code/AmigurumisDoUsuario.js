import React from 'react';
import AmigurumiCards from './AmigurumiCards';

// Agora recebe a lista filtrada por props e apenas renderiza
export default function AmigurumisDoUsuario({ amigurumis, trigger }) {
  if (!amigurumis || amigurumis.length === 0) {
    return <p>Nenhum amigurumi encontrado.</p>;
  }

  return (
    <div>
      <AmigurumiCards
        filteredData={amigurumis}
        trigger={trigger}
        editable={false}
        redirection={true}
      />
    </div>
  );
}
