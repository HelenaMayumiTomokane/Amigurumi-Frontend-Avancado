import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <div id="master_head">
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
        <button
          className="button_title"
          onClick={() => (window.location.href = '/')}
        >
          🏠 Home
        </button>

        <button
          className="button_title"
          onClick={() => (window.location.href = '/favoritos')}
        >
          ❤️ Favoritos
        </button>
      </h1>
    </div>
  );
}
