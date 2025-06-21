import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';
import Receita from './pages/receita/Receita.js';
import Usuario from './pages/Usuario/Usuario';
// ... importe outras páginas

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/receita" element={<Receita/>} />
      <Route path="/usuario" element={<Usuario />} />
      {/* Adicione outras rotas conforme necessário */}
    </Routes>
  );
}

export default App;
