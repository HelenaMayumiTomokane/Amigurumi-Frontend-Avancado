import React from 'react';
import AmigurumiCards from './AmigurumiCards';

export default function AmigurumisDoUsuario({ amigurumis, trigger }) {
  if (!amigurumis?.length) {
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
