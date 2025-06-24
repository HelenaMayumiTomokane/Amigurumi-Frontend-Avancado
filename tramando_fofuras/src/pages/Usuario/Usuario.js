import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  APIGet_AccountUser,
  APIPut_AccountUser,
  APIGet_FoundationList
} from '../../components/support_code/API';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import BotaoNovoAmigurumi from "../../components/support_code/SaveFoundationList";
import AmigurumisDoUsuario from '../../components/support_code/AmigurumisDoUsuario';
import SearchBar from '../../components/support_code/Searchbar';
import './Usuario.css';

export default function Usuario() {
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Visitante');
  const [roleChanged, setRoleChanged] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = parseInt(queryParams.get('id'));

  const saveUserInfoLocalStorage = (user) => {
    localStorage.setItem('userInfo', JSON.stringify({
      user_id: user.user_id,
      login: user.login,
      name: user.name,
      password: user.password,
      role: user.role || 'Visitante'
    }));
  };

  useEffect(() => {
    if (!userId) return;

    APIGet_AccountUser()
      .then(users => {
        const user = users.find(u => u.user_id === userId);
        if (user) {
          const saved = localStorage.getItem('userInfo');
          const localRole = saved ? JSON.parse(saved).role : null;
          const roleToUse = localRole || user.role || 'Visitante';
          const updatedUser = { ...user, role: roleToUse };

          setUserInfo(updatedUser);
          setSelectedRole(roleToUse);
          saveUserInfoLocalStorage(updatedUser);
        } else {
          console.error('Usuário não encontrado');
        }
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (userInfo) {
      APIGet_FoundationList()
        .then(data => {
          const doUsuario = data.filter(item => item.autor === userInfo.login);
          setAmigurumis(doUsuario);
          setFilteredAmigurumis(doUsuario);
        })
        .catch(console.error);
    }
  }, [userInfo]);

  function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSymbol;
  }

  const handleChangePassword = () => {
    if (newPassword.trim() && passwordValid && userInfo) {
      const updatedUser = { ...userInfo, password: newPassword };
      setUserInfo(updatedUser);
      saveUserInfoLocalStorage(updatedUser);

      setNewPassword('');
      setPasswordValid(false);
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    }
  };

  const handleChangeName = () => {
    if (newName.trim() && userInfo) {
      const updatedUser = { ...userInfo, name: newName };
      setUserInfo(updatedUser);
      saveUserInfoLocalStorage(updatedUser);

      setNewName('');
      setNameChanged(true);
      setTimeout(() => setNameChanged(false), 3000);
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    setRoleChanged(true);

    if (userInfo) {
      const updatedUser = { ...userInfo, role: newRole };
      setUserInfo(updatedUser);
      saveUserInfoLocalStorage(updatedUser);
    }
  };

  const handleSaveChanges = () => {
    if (!userInfo) return;

    APIPut_AccountUser(
      userInfo.user_id,
      userInfo.name,
      userInfo.password,
      userInfo.login,
      selectedRole
    )
      .then(res => {
        if (!res.error) {
          const updatedUser = { ...userInfo, role: selectedRole };
          setUserInfo(updatedUser);
          saveUserInfoLocalStorage(updatedUser);

          setUpdateMessage('Perfil atualizado com sucesso!');
          setRoleChanged(false);
          setTimeout(() => setUpdateMessage(''), 3000);
        } else {
          setUpdateMessage('Erro ao atualizar: ' + res.error);
        }
      })
      .catch(() => setUpdateMessage('Erro na comunicação com o servidor'));
  };

  return (
    <div>
      <Header />
      <div className="data_body">
        {userInfo ? (
          <>
            <h2>Bem-vindo, {userInfo.login}!</h2>

            <div className="linha-horizontal">
              <strong>Nome completo:</strong>
              <input
                type="text"
                placeholder={userInfo.name || "Informe seu nome"}
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <button onClick={handleChangeName}>Alterar nome</button>
            </div>

            <div className="linha-horizontal">
              <strong>Login:</strong>
              <input
                type="text"
                value={userInfo.login}
                readOnly
                disabled
              />
            </div>

            <div className="linha-horizontal">
              <strong>Senha:</strong>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setPasswordValid(validatePassword(e.target.value));
                }}
              />
              <button
                type="button"
                className="botao-olho"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              <button onClick={handleChangePassword} disabled={!passwordValid}>
                Alterar senha
              </button>
            </div>

            {newPassword && (
              <p className={passwordValid ? "valido" : "invalido"}>
                {passwordValid
                  ? "Senha válida: contém letra, número e símbolo."
                  : "A senha deve conter letra, número e símbolo."}
              </p>
            )}

            <label htmlFor="role-select"><strong>Tipo de usuário:</strong></label>
            <select id="role-select" value={selectedRole} onChange={handleRoleChange}>
              <option value="Administrador">Administrador</option>
              <option value="Visitante">Visitante</option>
            </select>

            {roleChanged && <button onClick={handleSaveChanges}>Salvar alterações</button>}
            {updateMessage && <p className="mensagem-sucesso">{updateMessage}</p>}

            <hr />
            <h3>Ações rápidas</h3>
            {userInfo.role === 'Administrador' && <BotaoNovoAmigurumi />}

            <hr />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              amigurumis={amigurumis}
              setFilteredAmigurumis={setFilteredAmigurumis}
            />
            <AmigurumisDoUsuario
              username={userInfo.login}
              trigger={selectedRole}
              amigurumis={filteredAmigurumis}
            />
          </>
        ) : (
          <p>Carregando dados do usuário...</p>
        )}
        <br />
      </div>
      <Footer />
    </div>
  );
}
