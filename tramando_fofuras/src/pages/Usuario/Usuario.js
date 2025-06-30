import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  APIGet_AccountUser,
  APIPut_AccountUser,
  APIDelete_AccountUser
} from '../../components/api/AccountUser_API';
import { APIGet_FoundationList } from '../../components/api/Foundation_API';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import BotaoNovoAmigurumi from "../../components/api_save_edit/SaveFoundationList";
import AmigurumisDoUsuario from '../../components/amigurumi_cards/AmigurumisDoUsuario';
import SearchBar from '../../components/support_code/Searchbar';
import './Usuario.css';

export default function Usuario() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Visitante');
  const [updateMessage, setUpdateMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = parseInt(queryParams.get('user_id'));

  useEffect(() => {
    if (!userId) return;

    APIGet_AccountUser()
      .then(users => {
        const user = users.find(u => u.user_id === userId);
        if (user) {
          setUserInfo(user);
          setSelectedRole(user.role || 'Visitante');
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
      // Só ativa botão salvar, não precisa mostrar BotaoNovoAmigurumi aqui
    }
  };

  const handleChangeName = () => {
    if (newName.trim() && userInfo) {
      // Só ativa botão salvar, não precisa mostrar BotaoNovoAmigurumi aqui
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
  };

  const handleSaveChanges = () => {
    if (!userInfo) return;

    const updatedName = newName.trim() || userInfo.name;
    const updatedPassword = newPassword.trim() || userInfo.password;

    APIPut_AccountUser(
      userInfo.user_id,
      updatedName,
      updatedPassword,
      userInfo.login,
      selectedRole
    )
      .then(res => {
        if (!res.error) {
          const updatedUser = {
            ...userInfo,
            name: updatedName,
            password: updatedPassword,
            role: selectedRole
          };
          setUserInfo(updatedUser);
          setUpdateMessage('Perfil atualizado com sucesso!');
          setNewName('');
          setNewPassword('');
          setPasswordValid(false);
          setTimeout(() => setUpdateMessage(''), 3000);
          // Aqui o userInfo.role estará atualizado para exibir o botão
        } else {
          setUpdateMessage('Erro ao atualizar: ' + res.error);
        }
      })
      .catch(() => setUpdateMessage('Erro na comunicação com o servidor'));
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;

    APIGet_AccountUser()
      .then(users => {
        const user = users.find(u => u.user_id === userId);
        if (!user) {
          alert('Usuário não encontrado.');
          return;
        }

        APIDelete_AccountUser(user.user_id)
          .then(() => {
            const logoutEvent = new Event("logout");
            window.dispatchEvent(logoutEvent);
            navigate('/');
          })
          .catch(() => {
            alert('Erro ao excluir a conta.');
          });
      })
      .catch(() => {
        alert('Erro ao buscar usuário.');
      });
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
                value={newName || userInfo.name || ''}
                onChange={e => setNewName(e.target.value)}
              />
              <button onClick={handleChangeName}>Alterar nome</button>
            </div>

            <div className="linha-horizontal">
              <strong>Login:</strong>
              <input type="text" value={userInfo.login} readOnly disabled />
            </div>

            <div className="linha-horizontal">
              <strong>Senha:</strong>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword || ''}
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

            <br /><br />

            <button onClick={handleSaveChanges}>Salvar alterações</button>
            {updateMessage && <p className="mensagem-sucesso">{updateMessage}</p>}

            <hr />
            <h3>Ações Rápidas</h3>
            <button onClick={handleDeleteAccount} className="botao-excluir-conta">
              ❌ Excluir minha conta
            </button>

            {/* Mostrar botão só se for Administrador */}
            {userInfo.role === 'Administrador' && <BotaoNovoAmigurumi />}

            <hr />
            <h1>Meus Amigurumis</h1>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              amigurumis={amigurumis}
              setFilteredAmigurumis={setFilteredAmigurumis}
            />
            <br />
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
