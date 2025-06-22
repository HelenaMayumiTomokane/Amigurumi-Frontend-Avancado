import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <div id="footer_data">
        <a href="/">
          <img
            src="/assets/image/image_id_logo.png"
            id="logo_company_footer"
            alt="Logo"
          />
        </a>

        <div id="contact_section">
          <h1>Contact us</h1>
          <p>📧 tramando_fofuras@gmail.com</p>
          <p>📞 +1-2345-6789</p>
          <p>📍 Rua dos Amigurumis, 123 – Bairro Crochê Feliz, São Paulo – SP</p>
        </div>

        <div id="site_map">
          <h1>Mapa do Site</h1>
          <a href="/">🏠 Home</a>
          <br></br>
          <a href="/Usuario">👤 Página do Usuário</a>
        </div>

        <div id="external_links">
          <h1>Links do Projeto</h1>
          <a href="https://github.com/HelenaMayumiTomokane/Amigurumi-Frontend-Avancado" target="_blank" rel="noopener noreferrer">🌐 GitHub Front-end</a>
          <a href="https://github.com/HelenaMayumiTomokane/Amigurumi-Backend-Avancado" target="_blank" rel="noopener noreferrer">🛠️ GitHub Back-end</a>
          <a href="https://www.figma.com/design/WMk810g4ul8yxoopjP9fch/Tramando-Fofuras?node-id=1-2&t=C2YJbHrdA99cRn61-0" target="_blank" rel="noopener noreferrer">🎨 Figma</a>
        </div>
      </div>

      <div id="legal_section">
        <p>© 2025 Tramando Fofuras. Todos os direitos reservados.</p>
        <p>Desenvolvido por Helena Mayumi Tomokane</p>
      </div>
    </footer>
  );
}
