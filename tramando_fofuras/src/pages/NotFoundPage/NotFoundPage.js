// src/pages/NotFoundPage.js
import React from 'react';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <div className="data_body">
        <h1>404 - Página não encontrada</h1>
        <p>Desculpe, a página que você está procurando não existe.</p>
        <a href="/">Voltar para a Home</a>
      </div>
      <br></br>
      <Footer />
    </>
  );
}
