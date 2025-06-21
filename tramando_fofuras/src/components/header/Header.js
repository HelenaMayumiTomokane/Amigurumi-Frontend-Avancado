import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }
  }, []);

  const handleLogin = () => {
    if (username && password) {
      const isAdmin = username.toLowerCase() === 'admin'; // Exemplo simples
      const role = isAdmin ? 'Administrador' : 'Visitante';

      const newUserInfo = { username, password, role };
      setUserInfo(newUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      alert('Preencha o nome e a senha.');
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

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

        {!userInfo && (
          <button
            className="button_title"
            onClick={() => setShowLogin(true)}
          >
            🔐 Login
          </button>
        )}

        {userInfo && (
          <>
            <button
              className="button_title"
              onClick={() => (window.location.href = '/usuario')}
              style={{ marginLeft: '10px' }}
            >
              👤 Página do Usuário
            </button>

            <button
              className="button_title"
              onClick={handleLogout}
              style={{ marginLeft: '10px' }}
            >
              🔓 Logout
            </button>
          </>
        )}
      </h1>

      {showLogin && (
        <div className="login_modal">
          <div className="login_box">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Nome"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login_buttons">
              <button onClick={handleLogin}>Entrar</button>
              <button onClick={() => setShowLogin(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
