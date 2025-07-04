import { useState, useEffect } from 'react';
import ConfirmBox from './ConfirmBox';

export default function ComentarioForm({ amigurumiId }) {
  const [comentario, setComentario] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  const [confirmIndex, setConfirmIndex] = useState(null);
  const [comentarioErro, setComentarioErro] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUserInfo(JSON.parse(storedUser));

    const saved = localStorage.getItem('comentarios');
    if (saved) {
      const parsed = JSON.parse(saved);
      setComentarios(parsed[amigurumiId] || []);
    }
  }, [amigurumiId]);

  const handleComentarioChange = (e) => {
    const texto = e.target.value;
    setComentario(texto);

    if (texto.length > 0 && texto.length < 2) {
      setComentarioErro('O comentário deve ter pelo menos 2 letras.');
    } else {
      setComentarioErro('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo) return;

    if (comentario.length < 2) {
      setMessage('O comentário deve ter pelo menos 2 letras.');
      setShowMessageBox(true);
      return;
    }

    const novoComentario = {
      user_id: userInfo.user_id,
      nome: userInfo.name || userInfo.login,
      comentario,
      avaliacao,
      data: new Date().toISOString()
    };

    const updatedComentarios = [...comentarios, novoComentario];
    setComentarios(updatedComentarios);

    const allComentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
    allComentarios[amigurumiId] = updatedComentarios;
    localStorage.setItem('comentarios', JSON.stringify(allComentarios));

    setComentario('');
    setAvaliacao(0);
    setComentarioErro('');
    setMessage('Comentário enviado com sucesso!');
    setShowMessageBox(true);
  };

  const handleCloseMessage = () => {
    setShowMessageBox(false);
  };

  const handleExcluirComentario = (index) => {
    setConfirmIndex(index);
  };

  const confirmarExclusao = () => {
    if (confirmIndex === null) return;

    const novaLista = [...comentarios];
    novaLista.splice(confirmIndex, 1);
    setComentarios(novaLista);

    const allComentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
    allComentarios[amigurumiId] = novaLista;
    localStorage.setItem('comentarios', JSON.stringify(allComentarios));

    setConfirmIndex(null);
  };

  const cancelarExclusao = () => {
    setConfirmIndex(null);
  };

  const renderEstrelas = () => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span
          key={i}
          onClick={() => setAvaliacao(i)}
          style={{ cursor: 'pointer', fontSize: '20px', color: i <= avaliacao ? '#FFD700' : '#ccc' }}
        >
          ★
        </span>
      );
    }

    estrelas.unshift(
      <span
        key="zero"
        onClick={() => setAvaliacao(0)}
        style={{
          cursor: 'pointer',
          fontSize: '14px',
          color: '#888',
          marginRight: '8px',
          verticalAlign: 'top'
        }}
        title="Sem avaliação"
      >
        ✖
      </span>
    );

    return estrelas;
  };

  if (!userInfo) return null;

  return (
    <div className="avaliacao_container">
      {/* Caixa de mensagem */}
      {showMessageBox && (
        <div className="simple-message-box-container">
          <div className="simple-message-box success">
            <p>{message}</p>
            <button onClick={handleCloseMessage}>OK</button>
          </div>
        </div>
      )}

      {/* Caixa de confirmação */}
      {confirmIndex !== null && (
        <ConfirmBox
          mensagem="Deseja realmente excluir este comentário?"
          onConfirmar={confirmarExclusao}
          onCancelar={cancelarExclusao}
        />
      )}

      <form onSubmit={handleSubmit} className="avaliacao_formulario">
        <h2>Deixe seu comentário</h2>
        <textarea
          value={comentario}
          onChange={handleComentarioChange}
          placeholder="Escreva seu comentário"
          required
        />
        {comentarioErro && (
          <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
            {comentarioErro}
          </p>
        )}

        <label>
          Avaliação:
          <div>{renderEstrelas()}</div>
        </label>
        <button type="submit" disabled={comentario.length < 2}>Enviar</button>
      </form>

      {comentarios.length > 0 && (
        <div className="comentarios-lista">
          <hr />
          <h2>Comentários anteriores</h2>
          {comentarios.map((c, i) => (
            <div key={i} className="comentario-item">
              <strong>{c.nome}</strong> – {c.avaliacao > 0 ? `${c.avaliacao}⭐` : "Sem avaliação"}
              <div><em>{new Date(c.data).toLocaleString()}</em></div>
              <p>{c.comentario}</p>

              {userInfo?.user_id === c.user_id && (
                <button
                  onClick={() => handleExcluirComentario(i)}
                  className="botao-excluir-comentario"
                >
                  🗑️ Excluir
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
