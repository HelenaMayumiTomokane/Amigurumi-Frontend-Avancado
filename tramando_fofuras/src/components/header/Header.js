import React, { useState, useEffect } from 'react';
import './Header.css';
import { APIGet_AccountUser } from '../support_code/API';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      setUserInfo(JSON.parse(stored));
    }
  }, []);

  const handleLogin = async () => {
    if (username && password) {
      try {
        const users = await APIGet_AccountUser();
        const user = users.find(u => u.login === username && u.password === password);

        if (user) {
          const newUserInfo = { login: user.login, user_id: user.user_id, role: user.role || 'Visitante' };
          setUserInfo(newUserInfo);
          localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
          setShowLogin(false);
          setUsername('');
          setPassword('');
          navigate(`/usuario?id=${user.user_id}`); // redireciona com useNavigate
        } else {
          alert('Usuário não encontrado. Cadastre-se primeiro.');
        }
      } catch (err) {
        console.error('Erro ao verificar usuários:', err);
      }
    } else {
      alert('Preencha o login e a senha.');
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/'); // redireciona para home
  };

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <a href="/">
            <img
              src="/assets/image/image_id_logo.png"
              alt="Logo"
              className="logo"
            />
          </a>
        </div>

        <div className="header-center">
          <button className="button_title" onClick={() => navigate('/')}>🏠 Home</button>
          {userInfo && (
            <button
              className="button_title"
              onClick={() => navigate(`/usuario?id=${userInfo.user_id}`)}
            >
              👤 Perfil
            </button>
          )}
        </div>

        <div className="header-right">
          {!userInfo ? (
            <>
              <button className="button_title" onClick={() => setShowLogin(true)}>🔐 Login</button>
              <button className="button_title" onClick={() => navigate('/cadastro')}>📝 Cadastro</button>
            </>
          ) : (
            <button className="button_title" onClick={handleLogout}>🔓 Logout</button>
          )}
        </div>
      </header>

      {showLogin && (
        <div className="login_modal">
          <div className="login_box">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Login"
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
    </>
  );
}
