import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <div id="master_head">
      {/* Link para fonte Google Fonts - ideal colocar no index.html, mas pode deixar aqui */}
      <link
        href="https://fonts.googleapis.com/css2?family=Princess+Sofia&display=swap"
        rel="stylesheet"
      />

      <a href="/">
        <img
          src="/assets/image/image_id_logo.png"
          id="logo_company_headear"
          alt="Logo"
        />
      </a>

      <h1 id="header_botton">
        {/* Em React não use onclick inline, use onClick com função */}
        <button
          className="button_title"
          onClick={() => (window.location.href = '/')}
        >
          Home
        </button>

        <button
          className="button_title"
          onClick={() => (window.location.href = 'receita')}
        >
          Receita
        </button>
      </h1>
    </div>
  );
}
