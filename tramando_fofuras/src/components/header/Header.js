import { useState } from 'react';
import './Header.css';
import { APIGet_AccountUser } from '../api/AccountUser_API';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserContext';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, login, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password) {
      try {
        const users = await APIGet_AccountUser();
        const user = users.find(u => u.login === username && u.password === password);
        if (user) {
          login({ login: user.login, user_id: user.user_id, role: user.role || 'Visitante' });
          setShowLogin(false);
          setUsername('');
          setPassword('');
          setShowPassword(false);
          navigate(`/usuario?user_id=${user.user_id}`);
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

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <a href="/">
            <img src="/assets/image/image_id_logo.png" alt="Logo" className="logo" />
          </a>
        </div>

        <div className="header-center">
          <button className="dark_button" onClick={() => navigate('/')}>🏠 Home</button>
          {userInfo && (
            <button className="dark_button" onClick={() => navigate(`/usuario?user_id=${userInfo.user_id}`)}>
              👤 Perfil
            </button>
          )}
        </div>

        <div className="header-right">
          {!userInfo ? (
            <>
              <button className="dark_button" onClick={() => setShowLogin(true)}>🔐 Login</button>
              <button className="dark_button" onClick={() => navigate('/cadastro')}>📝 Cadastro</button>
            </>
          ) : (
            <button className="dark_button" onClick={() => {logout(); navigate('/')}} > 🔓 Logout </button>
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

            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

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
