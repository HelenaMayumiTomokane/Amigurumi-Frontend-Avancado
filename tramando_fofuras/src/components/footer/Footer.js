import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <div id="footer_data">
        <a href="home.html">
          <img
            src="/assets/image/image_id_logo.png"
            id="logo_company_footer"
            alt="Logo"
          />
        </a>

        <div id="contact_section">
          <h1>Tramando Fofuras</h1>
          <h2>Contact us</h2>
          <p>tramando_fofuras@gmail.com</p>
          <p>+1-2345-6789</p>
        </div>

        <div id="site_map">
          <h1>Mapa do Site</h1>
          <a href="/">🏠 Home</a> <br></br>
          <br></br>
          <a href="favoritos">❤️ Favorito</a>
        </div>

      </div>

      <div id="legal_section">
        <p>© 2025 Tramando Fofuras. Todos os direitos reservados.</p>
        <p>Desenvolvido por Helena Mayumi Tomokane</p>
      </div>
    </footer>
  );
}
