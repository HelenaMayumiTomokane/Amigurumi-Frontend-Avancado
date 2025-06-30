import React, { useState, useEffect } from 'react';

export default function ComentarioForm({ amigurumiId }) {
  const [comentario, setComentario] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) setUserInfo(JSON.parse(storedUser));

    const saved = localStorage.getItem('comentarios');
    if (saved) {
      const parsed = JSON.parse(saved);
      setComentarios(parsed[amigurumiId] || []);
    }
  }, [amigurumiId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo) return;

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
    setMensagemSucesso('Comentário enviado com sucesso!');
    setTimeout(() => setMensagemSucesso(''), 3000);
  };

  const handleExcluirComentario = (index) => {
    if (!window.confirm("Deseja excluir este comentário?")) return;

    const novaLista = [...comentarios];
    novaLista.splice(index, 1);
    setComentarios(novaLista);

    const allComentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
    allComentarios[amigurumiId] = novaLista;
    localStorage.setItem('comentarios', JSON.stringify(allComentarios));
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
      <form onSubmit={handleSubmit} className="avaliacao_formulario">
        <h2>Deixe seu comentário</h2>
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Escreva seu comentário"
          required
        />
        <label>
          Avaliação:
          <div>{renderEstrelas()}</div>
        </label>
        <button type="submit">Enviar</button>
        {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}
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
