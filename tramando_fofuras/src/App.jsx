import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.js';
import Receita from './pages/receita/Receita.js';
import Usuario from './pages/Usuario/Usuario';
import Cadastro from './pages/Cadastro/Cadastro';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/receita" element={<Receita/>} />
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
