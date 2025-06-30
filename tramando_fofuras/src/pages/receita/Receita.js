import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

import MaterialList from '../../components/api_view_data/MaterialList';
import FoundationList from '../../components/api_view_data/FoundationList';
import Stitchbook from '../../components/api_view_data/Stitchbook';

import { saveFoundationChanges, BotaoDeleteAmigurumi } from '../../components/api_save_edit/SaveFoundationList';
import saveMaterialChanges from '../../components/api_save_edit/SaveMaterialChanges';
import saveStitchbookChanges from '../../components/api_save_edit/SaveStitchbookChanges';
import SaveImageChanges from '../../components/api_save_edit/SaveImageChanges';

import ComentarioForm from '../../components/support_code/ComentarioForm';

import AmigurumiCards from '../../components/amigurumi_cards/AmigurumiCards';
import Relationship from '../../components/amigurumi_cards/Relationship';

import useUserInfo from '../../components/hooks/useUserInfo';
import useAmigurumiId from '../../components/hooks/useAmigurumiId';
import useTriggerReload from '../../components/hooks/useTriggerReload';

import './Receita.css';

export default function Receita() {
  const navigate = useNavigate();

  const { userInfo } = useUserInfo();

  const amigurumiId = useAmigurumiId();
  const [triggerLoad, setTriggerLoad] = useTriggerReload();
  const [editable, setEditable] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const foundationRef = useRef();
  const materialRef = useRef();
  const stitchbookRef = useRef();

  const handleDeleted = () => {
    navigate('/');
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
      setTriggerLoad();
    }

    const stitchbookOriginal = stitchbookRef.current?.getOriginalList();
    const stitchbookCurrent = stitchbookRef.current?.getCurrentList();

    if (stitchbookOriginal && stitchbookCurrent) {
      await saveStitchbookChanges(stitchbookOriginal, stitchbookCurrent);
      setTriggerLoad();
    }

    setEditable(false);
  };

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
              onClick={() => navigate(`/receita?amigurumi_id=${amigurumiId}`)}
              title="Receita"
            >
              <span className="button_icon">🧸</span> Receita
            </button>
          </div>

          {canEdit && (
            <div>
              <button onClick={() => setEditable(prev => !prev)}>
                {editable ? 'Desligar Edição' : 'Ligar Edição'}
              </button>

              {editable && (
                <>
                  <button onClick={handleSave}>Salvar</button>
                  <BotaoDeleteAmigurumi amigurumiId={amigurumiId} onDeleted={handleDeleted} />
                </>
              )}
            </div>
          )}

          {!canEdit && (
            <div style={{color: 'red', marginLeft: 10}}>
              {/* Só para debug */}
              Você não tem permissão para editar.
            </div>
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
            <br />
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

        <br />
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
