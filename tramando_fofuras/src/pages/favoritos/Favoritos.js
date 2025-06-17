import React, { useEffect, useState } from 'react';
import AmigurumiCards from '../../components/support_code/AmigurumiCards';
import * as API from '../../components/support_code/API';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

export default function Favoritos() {
  const [data, setData] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const todos = await API.APIGet_FoundationList();
      const stored = localStorage.getItem('favoriteAmigurumis');
      const favoriteIds = stored ? JSON.parse(stored) : [];

      const favoritos = todos.filter(amig =>
        favoriteIds.includes(amig.amigurumi_id)
      );

      setData(favoritos);
    }

    fetchData();
  }, [trigger]);

  return (
    <div>
      <Header />
      <br />

      <div className="data_body">

      <h2>Meus Amigurumis Favoritos ❤️</h2>
        <AmigurumiCards filteredData={data}trigger={trigger}setTrigger={setTrigger} editable={false}redirection={true}/>
      </div>

      <br></br>
      <Footer />
    </div>
  );
}
