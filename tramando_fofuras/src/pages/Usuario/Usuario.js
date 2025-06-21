import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

export default function Usuario() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Visitante');
  const [roleChanged, setRoleChanged] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Carrega info do usuário no localStorage ao montar componente
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

  // Atualiza o papel do usuário selecionado
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setRoleChanged(true);
  };

  // Atualiza senha do usuário
  const handleChangePassword = () => {
    if (newPassword.trim()) {
      const updatedUser = { ...userInfo, password: newPassword };
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setNewPassword('');
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    }
  };

  // Atualiza dados do usuário (função)
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

  return (
    <div>
      <Header />
      <div className="data_body" style={{ maxWidth: 600, margin: '0 auto' }}>
        {userInfo ? (
          <>
            <h2>Bem-vindo, {userInfo.username}!</h2>

            <p><strong>Nome:</strong> {userInfo.username}</p>
            <p><strong>Senha:</strong> {userInfo.password}</p>

            <label htmlFor="role-select"><strong>Tipo de usuário:</strong></label>{' '}
            <select
              id="role-select"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="Administrador">Administrador</option>
              <option value="Visitante">Visitante</option>
            </select>

            {roleChanged && (
              <button onClick={handleUpdate} style={{ marginLeft: '10px' }}>
                Atualizar
              </button>
            )}

            {updateMessage && (
              <p style={{ color: 'green', marginTop: '10px' }}>{updateMessage}</p>
            )}

            <hr />

            <h3>Alterar senha</h3>
            <input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ padding: '6px', marginRight: '8px' }}
            />
            <button onClick={handleChangePassword}>Alterar senha</button>
            {passwordChanged && (
              <p style={{ color: 'green', marginTop: '10px' }}>
                Senha alterada com sucesso!
              </p>
            )}

            
       

            <hr />

            <h3>Ações rápidas</h3>
            <button
              style={{ marginRight: '10px' }}
              onClick={() => window.location.href = '/novo-amigurumi'}
            >
              Novo Amigurumi
            </button>
            <button onClick={() => window.location.href = '/meus-amigurumis'}>
              Meus Amigurumis
            </button>
          </>
        ) : (
          <>
            <h2>Usuário não logado.</h2>
            <p>Por favor, faça login para acessar esta página.</p>
          </>
        )}
      </div>
      <br></br>
      <Footer />
    </div>
  );
}
