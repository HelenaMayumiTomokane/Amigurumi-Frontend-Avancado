import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';
import Receita from './pages/receita/Receita.js';
// ... importe outras páginas

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/receita" element={<Receita />} />
      {/* Adicione outras rotas conforme necessário */}
    </Routes>
  );
}

export default App;
