import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import MaterialList from '../../components/support_code/MaterialList';
import FoundationList from '../../components/support_code/FoundationList';
import AmigurumiCards from '../../components/support_code/AmigurumiCards';
import Stitchbook from '../../components/support_code/Stitchbook';
import { saveFoundationChanges } from '../../components/support_code/SaveFoundationList';
import saveMaterialChanges from '../../components/support_code/SaveMaterialChanges';
import saveStitchbookChanges from '../../components/support_code/SaveStitchbookChanges';
import { BotaoDeleteAmigurumi } from '../../components/support_code/SaveFoundationList';
import Relationship from '../../components/support_code/Relationship';
import SaveImageChanges from '../../components/support_code/SaveImageChanges';
import ComentarioForm from '../../components/support_code/ComentarioForm';

import './Receita.css';

export default function Receita() {
  const navigate = useNavigate();
  const location = useLocation();

  const [triggerLoad, setTriggerLoad] = useState(0);
  const [amigurumiId, setAmigurumiId] = useState(null);
  const [editable, setEditable] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const foundationRef = useRef();
  const materialRef = useRef();
  const stitchbookRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromURL = params.get('id');

    if (idFromURL) {
      setAmigurumiId(parseInt(idFromURL));
      setTriggerLoad(prev => prev + 1);
    }

    // Ler info do usuário do localStorage
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleDeleted = () => {
    navigate('/')
  };

  const filteredData = amigurumiId ? [{ amigurumi_id: amigurumiId }] : [];

  const handleSave = async () => {
    console.log('🔒 Salvando alterações...');

    const foundationOriginal = foundationRef.current?.getOriginalList();
    const foundationCurrent = foundationRef.current?.getCurrentList();

    if (foundationOriginal && foundationCurrent) {
      await saveFoundationChanges(foundationOriginal, foundationCurrent);
      foundationRef.current.updateOriginalList();
    }

    const materialOriginal = materialRef.current?.getOriginalList();
    const materialCurrent = materialRef.current?.getCurrentList();

    if (materialOriginal && materialCurrent) {
      await saveMaterialChanges(materialOriginal, materialCurrent);
      materialRef.current.updateOriginalList();
      setTriggerLoad(prev => prev + 1);
    }

    const stitchbookOriginal = stitchbookRef.current?.getOriginalList();
    const stitchbookCurrent = stitchbookRef.current?.getCurrentList();

    if (stitchbookOriginal && stitchbookCurrent) {
      await saveStitchbookChanges(stitchbookOriginal, stitchbookCurrent);
      setTriggerLoad(prev => prev + 1);
    }

    setEditable(false);
  };

  // Só permite editar se usuário for admin
  const canEdit = userInfo?.role === 'Administrador';

  return (
    <div>
      <Header />

      <div className="data_body">
        <br />
        <div id="button_top">
          <div className="breadcrumbs_container">
            <button
              className="button_title_transparent"
              onClick={() => navigate('/')}
              title="Home"
            >
              <span className="button_icon">🏠</span> Home
            </button>
            
            <span className="separator">{'>'}</span>

            <button
              className="button_title_transparent"
              onClick={() => navigate(`/receita?id=${amigurumiId}`)}
              title="Receita"
            >
              <span className="button_icon">🧸</span> Receita
            </button>
          </div>

          {canEdit && (
          <>
            <div>
              <button onClick={() => setEditable(prev => !prev)}>
                {editable ? 'Desligar Edição' : 'Ligar Edição'}
              </button>

              {editable && (
                <>
                  <button onClick={handleSave}>
                    Salvar
                  </button>

                  <BotaoDeleteAmigurumi amigurumiId={amigurumiId} onDeleted={handleDeleted} />
                </>
              )}
            </div>
          </>
          )}
        </div>


        {showImageModal && (
          <SaveImageChanges amigurumiId={amigurumiId} onClose={() => setShowImageModal(false)} />
        )}

        <div id="full_amigurumi_data">
          <div id="amigurumi_information">
          <FoundationList ref={foundationRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />
          </div>

          <div id="card_amigurumi_recipe">
            <AmigurumiCards filteredData={filteredData} trigger={triggerLoad} editable={editable} redirection={false} />
            <br></br>
            {editable && (
              <button onClick={() => setShowImageModal(true)}>
                Gerenciar Imagens
              </button>
            )}
          </div>

          
        </div>
        
        
        <MaterialList ref={materialRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />

        <br /><br />
        <div id="div_stitchbookList">
          <h2>Montagem</h2>
          <Stitchbook ref={stitchbookRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />
        </div>

        

        {userInfo && (
          <div className="comentario-container">
            <ComentarioForm amigurumiId={amigurumiId} />
          </div>
        )}


        <br></br>

        <div id="card_relationship_backgroud">
          <div id="card_relationship">
            <Relationship amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
