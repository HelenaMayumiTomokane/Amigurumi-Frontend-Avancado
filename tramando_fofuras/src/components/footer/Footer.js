import './Footer.css';
import { Link } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';

export default function Footer() {
  const { userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  return (
    <footer id="footer">
      <div id="footer_data">
        <Link to="/">
          <img
            src="/assets/image/image_id_logo.png"
            id="logo_company_footer"
            alt="Logo"
          />
        </Link>

        <div id="contact_section">
          <h1>Contact us</h1>
          <p>📞 +1-2345-6789</p>
          <p>📧 <a href="mailto:tramando_fofuras@gmail.com">tramando_fofuras@gmail.com</a></p>
          <p>
            📍 <a href="https://www.google.com/maps/search/?api=1&query=Rua+dos+Amigurumis,+123,+Bairro+Crochê+Feliz,+São+Paulo,+SP" target="_blank" rel="noopener noreferrer">
              Rua dos Amigurumis, 123 – Bairro Crochê Feliz, São Paulo – SP
            </a>
          </p>
        </div>

        <div id="site_map">
          <h1>Mapa do Site</h1>
          <Link to="/">🏠 Home</Link>
          <br />
          {userId ? (
            <Link to={`/usuario?user_id=${userId}`}>👤 Perfil</Link>
          ) : (
            <Link to="/cadastro">👤 Cadastre-se</Link>
          )}
        </div>

        <div id="external_links">
          <h1>Links do Projeto</h1>
          <a href="https://github.com/HelenaMayumiTomokane/Amigurumi-Frontend-Avancado" target="_blank" rel="noopener noreferrer">🌐 GitHub Front-end</a>
          <a href="https://github.com/HelenaMayumiTomokane/Amigurumi-Backend-Avancado" target="_blank" rel="noopener noreferrer">🛠️ GitHub Back-end</a>
          <a href="https://www.figma.com/design/WMk810g4ul8yxoopjP9fch/Tramando-Fofuras?node-id=1-2&t=C2YJbHrdA99cRn61-0" target="_blank" rel="noopener noreferrer">🎨 Figma</a>
          <a href="https://www.postman.com/research-astronomer-36303923/amigurumi-api/overview" target="_blank" rel="noopener noreferrer">🚀 Postman</a>
        </div>
      </div>

      <div id="legal_section">
        <p>© 2025 Tramando Fofuras. Todos os direitos reservados.</p>
        <p>Desenvolvido por Helena Mayumi Tomokane</p>
      </div>
    </footer>
  );
}
