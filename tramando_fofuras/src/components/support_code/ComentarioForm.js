import React, { useState, useEffect } from 'react';

export default function ComentarioForm({ amigurumiId }) {
  const [comentario, setComentario] = useState('');
  const [avaliacao, setAvaliacao] = useState(5);
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
      data: new Date().toLocaleString()
    };

    const updatedComentarios = [...comentarios, novoComentario];
    setComentarios(updatedComentarios);

    const allComentarios = JSON.parse(localStorage.getItem('comentarios')) || {};
    allComentarios[amigurumiId] = updatedComentarios;
    localStorage.setItem('comentarios', JSON.stringify(allComentarios));

    setComentario('');
    setAvaliacao(5);
    setMensagemSucesso('Comentário enviado com sucesso!');

    setTimeout(() => setMensagemSucesso(''), 3000);
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
          <select value={avaliacao} onChange={e => setAvaliacao(parseInt(e.target.value))}>
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} estrela{n > 1 && 's'}</option>
            ))}
          </select>
        </label>
        <button type="submit">Enviar</button>
        {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}
      </form>
      <br></br>
      

      {comentarios.length > 0 && (
        <div className="comentarios-lista">
          <hr></hr>
          <h2>Comentários anteriores</h2>
          {comentarios.map((c, i) => (
            <div key={i} className="comentario-item">
              <strong>{c.nome}</strong> - {c.avaliacao}⭐
              <div><em>{c.data}</em></div>
              <p>{c.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
