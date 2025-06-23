import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import BotaoNovoAmigurumi from "../../components/support_code/SaveFoundationList";
import AmigurumisDoUsuario from '../../components/support_code/AmigurumisDoUsuario';
import SearchBar from '../../components/support_code/Searchbar';
import { APIGet_FoundationList } from '../../components/support_code/API';
import './Usuario.css';

export default function Usuario() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Visitante');
  const [roleChanged, setRoleChanged] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserInfo(parsed);
        setSelectedRole(parsed.role || 'Visitante');
      } catch {
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  useEffect(() => {
    if (userInfo) {
      APIGet_FoundationList()
        .then(data => {
          const doUsuario = data.filter(item => item.autor === userInfo.username);
          setAmigurumis(doUsuario);
          setFilteredAmigurumis(doUsuario);
        })
        .catch(error => console.error("Erro ao carregar amigurumis:", error));
    }
  }, [userInfo]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setRoleChanged(true);
  };

  const handleChangePassword = () => {
    if (newPassword.trim() && passwordValid) {
      const updatedUser = { ...userInfo, password: newPassword };
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setNewPassword('');
      setPasswordValid(false);
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    }
  };

  const handleChangeUsername = () => {
    if (newUsername.trim()) {
      const updatedUser = { ...userInfo, username: newUsername };
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setNewUsername('');
      setNameChanged(true);
      setTimeout(() => setNameChanged(false), 3000);
    }
  };

  const handleUpdate = () => {
    if (userInfo) {
      const updatedUser = { ...userInfo, role: selectedRole };
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setRoleChanged(false);
      setUpdateMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  // Função para validar senha: letra + número + símbolo
  function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSymbol;
  }

  return (
    <div>
      <Header />
      <div className="data_body">
        {userInfo ? (
          <>
            <h2>Bem-vindo, {userInfo.username}!</h2>

            <div className="linha-horizontal">
              <strong>Nome:</strong>
              <input
                type="text"
                placeholder={userInfo.username}
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
              <button onClick={handleChangeUsername}>Alterar nome</button>
            </div>
            {nameChanged && <p className="mensagem-sucesso">Nome alterado com sucesso!</p>}

            <div className="linha-horizontal">
              <strong>Senha:</strong>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={userInfo.password}
                value={newPassword}
                onChange={e => {
                  const value = e.target.value;
                  setNewPassword(value);
                  setPasswordValid(validatePassword(value));
                }}
              />
              <button
                type="button"
                className="botao-olho"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  // ícone olho fechado
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.05 0-9.3-3.16-11-7 1.07-2.23 2.87-4.16 5.22-5.36"/>
                    <path d="M1 1l22 22"/>
                  </svg>
                ) : (
                  // ícone olho aberto
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              <button onClick={handleChangePassword} disabled={!passwordValid}>
                Alterar senha
              </button>
            </div>

            {/* Feedback visual da senha */}
            {newPassword && (
              <p className={passwordValid ? "valido" : "invalido"}>
                {passwordValid
                  ? "Senha válida: contém letra, número e símbolo."
                  : "A senha deve conter pelo menos uma letra, um número e um símbolo."}
              </p>
            )}

            {passwordChanged && <p className="mensagem-sucesso">Senha alterada com sucesso!</p>}

            <label htmlFor="role-select"><strong>Tipo de usuário:</strong></label>
            <select id="role-select" value={selectedRole} onChange={handleRoleChange}>
              <option value="Administrador">Administrador</option>
              <option value="Visitante">Visitante</option>
            </select>

            {roleChanged && <button onClick={handleUpdate}>Atualizar</button>}
            {updateMessage && <p className="mensagem-sucesso">{updateMessage}</p>}

            <hr />
            <h3>Ações rápidas</h3>
            {userInfo.role === 'Administrador' && <BotaoNovoAmigurumi />}

            <hr />
            {/* 🔍 SearchBar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              amigurumis={amigurumis}
              setFilteredAmigurumis={setFilteredAmigurumis}
            />

            {/* 🧶 Lista filtrada */}
            <AmigurumisDoUsuario
              username={userInfo.username}
              trigger={selectedRole}
              amigurumis={filteredAmigurumis}
            />
          </>
        ) : (
          <>
            <h2>Usuário não logado.</h2>
            <p>Por favor, faça login para acessar esta página.</p>
          </>
        )}
        <br />
      </div>
      <Footer />
    </div>
  );
}
