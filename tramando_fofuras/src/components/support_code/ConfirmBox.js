export default function ConfirmBox({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="confirmacao-box-container">
      <div className="confirmacao-box">
        <h3>{mensagem}</h3>
        <button onClick={onConfirmar}>Sim</button>
        <button onClick={onCancelar} className="cancelar">Cancelar</button>
      </div>
    </div>
  );
}
