import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import * as API from '../../components/api/AccountUser_API';
import { useUserContext } from '../../contexts/UserContext';

export default function CadastroPage() {
  const [name, setName] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('Visitante');
  const [erro, setErro] = useState('');
  const [senhaValida, setSenhaValida] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUserContext(); // <<< Importante!

  function validarSenha(senha) {
    const temLetra = /[a-zA-Z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    return temLetra && temNumero && temSimbolo;
  }

  const handleCadastro = async () => {
    setErro('');

    if (!name || !loginInput || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro("Senha inválida: use letra, número e símbolo.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.APIPost_AccountUser(name, senha, loginInput, role);

      if (response.error) {
        setErro(response.error);
      } else if (response.user_id) {
        // Salvar login no contexto e localStorage
        login({
          login: loginInput,
          user_id: response.user_id,
          role: role || 'Visitante'
        });

        navigate(`/usuario?user_id=${response.user_id}`);
      } else {
        setErro("Erro inesperado: usuário não retornado pela API.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setErro("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <br />

      <div className="data_body">
        <h2>Cadastro de Novo Usuário</h2>

        <div className="linha-horizontal">
          <strong>Nome completo:</strong>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="linha-horizontal">
          <strong>Login:</strong>
          <input value={loginInput} onChange={e => setLoginInput(e.target.value)} />
        </div>

        <div className="linha-horizontal">
          <strong>Senha:</strong>
          <input
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={e => {
              const val = e.target.value;
              setSenha(val);
              setSenhaValida(validarSenha(val));
            }}
          />
          <button
            type="button"
            className="botao-olho"
            onClick={() => setMostrarSenha(prev => !prev)}
          >
            {mostrarSenha ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {senha && (
          <p className={senhaValida ? "valido" : "invalido"}>
            {senhaValida
              ? "Senha válida: contém letra, número e símbolo."
              : "A senha deve conter letra, número e símbolo."}
          </p>
        )}

        <div className="linha-horizontal">
          <strong>Tipo de usuário:</strong>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="Visitante">Visitante</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        {erro && <p className="invalido">{erro}</p>}

        <button onClick={handleCadastro} disabled={!senhaValida || loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar e Entrar'}
        </button>
      </div>

      <br />
      <Footer />
    </>
  );
}
