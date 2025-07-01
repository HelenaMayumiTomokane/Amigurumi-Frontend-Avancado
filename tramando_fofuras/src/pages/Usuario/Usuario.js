import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { APIGet_AccountUser, APIPut_AccountUser, APIDelete_AccountUser } from '../../components/api/AccountUser_API';
import { APIGet_FoundationList } from '../../components/api/Foundation_API';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import BotaoNovoAmigurumi from "../../components/api_save_edit/SaveFoundationList";
import AmigurumisDoUsuario from '../../components/amigurumi_cards/AmigurumisDoUsuario';
import SearchBar from '../../components/support_code/Searchbar';
import ConfirmBox from '../../components/support_code/ConfirmBox';

import './Usuario.css';

export default function Usuario() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Visitante');
  const [showPassword, setShowPassword] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [amigurumis, setAmigurumis] = useState([]);
  const [filteredAmigurumis, setFilteredAmigurumis] = useState([]);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageBoxText, setMessageBoxText] = useState('');
  const [messageBoxType, setMessageBoxType] = useState('success');

  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = parseInt(queryParams.get('user_id'));

  // Carregar dados do usuário
  useEffect(() => {
    if (!userId) return;

    APIGet_AccountUser()
      .then(users => {
        const user = users.find(u => u.user_id === userId);
        if (user) {
          setUserInfo(user);
          setSelectedRole(user.role || 'Visitante');
        } else {
          showMessage("Usuário não encontrado", "error");
        }
      })
      .catch(() => showMessage("Erro ao carregar usuário", "error"));
  }, [userId]);

  // Carregar amigurumis do usuário
  useEffect(() => {
    if (userInfo) {
      APIGet_FoundationList()
        .then(data => {
          const doUsuario = data.filter(item => item.autor === userInfo.login);
          setAmigurumis(doUsuario);
          setFilteredAmigurumis(doUsuario);
        })
        .catch(() => showMessage("Erro ao carregar amigurumis", "error"));
    }
  }, [userInfo]);

  // Validação básica da senha
  function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLetter && hasNumber && hasSymbol;
  }

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Função para mostrar mensagem na caixa simples
  function showMessage(text, type = 'success') {
    setMessageBoxText(text);
    setMessageBoxType(type);
    setShowMessageBox(true);
  }

  // Salvar alterações do usuário
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
          setNewName('');
          setNewPassword('');
          setPasswordValid(false);
          showMessage("Perfil atualizado com sucesso!", "success");
        } else {
          showMessage("Erro ao atualizar: " + res.error, "error");
        }
      })
      .catch(() => showMessage("Erro na comunicação com o servidor", "error"));
  };

  // Função que realmente executa a exclusão da conta após confirmação
  const confirmarExclusao = () => {
    APIGet_AccountUser()
      .then(users => {
        const user = users.find(u => u.user_id === userId);
        if (!user) {
          showMessage("Usuário não encontrado", "error");
          return;
        }

        APIDelete_AccountUser(user.user_id)
          .then(() => {
            const logoutEvent = new Event("logout");
            window.dispatchEvent(logoutEvent);
            navigate('/');
          })
          .catch(() => showMessage("Erro ao excluir a conta", "error"));
      })
      .catch(() => showMessage("Erro ao buscar usuário", "error"));
  };

  // Mostra caixa de confirmação para excluir conta
  const handleDeleteAccount = () => {
    setShowConfirmBox(true);
  };

  // Componente caixa simples de mensagem
  function MessageBox() {
    if (!showMessageBox) return null;

    return (
      <div className="simple-message-box-container">
        <div className={`simple-message-box ${messageBoxType}`}>
          <p>{messageBoxText}</p>
          <button onClick={() => setShowMessageBox(false)}>OK</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <MessageBox />
      {showConfirmBox && (
        <ConfirmBox
          mensagem="Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
          onConfirmar={() => {
            setShowConfirmBox(false);
            confirmarExclusao();
          }}
          onCancelar={() => setShowConfirmBox(false)}
        />
      )}
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
            </div>

            <div className="linha-horizontal">
              <strong>Login:</strong>
              <input type="text" value={userInfo.login} readOnly disabled />
            </div>

            <div className="linha-horizontal">
              <strong>Senha:</strong>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword || userInfo.password}
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

            <hr />
            <h3>Ações Rápidas</h3>
            <button onClick={handleDeleteAccount} className="botao-excluir-conta">
              ❌ Excluir minha conta
            </button>

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
