import React, { useEffect, useState, useRef } from 'react';
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
import  Relationship  from '../../components/support_code/Relationship';
import SaveImageChanges from '../../components/support_code/SaveImageChanges';


import './Receita.css';

export default function Receita() {
  const [triggerLoad, setTriggerLoad] = useState(0);
  const [amigurumiId, setAmigurumiId] = useState(null);
  const [editable, setEditable] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const foundationRef = useRef();
  const materialRef = useRef();
  const stitchbookRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromURL = params.get('id');
    if (idFromURL) {
      setAmigurumiId(parseInt(idFromURL));
      setTriggerLoad(prev => prev + 1);
    }
  }, []);

  const handleDeleted = () => {
    window.location.href = '/';
  };

  const filteredData = amigurumiId ? [{ amigurumi_id: amigurumiId }] : [];

  const handleSave = async () => {
    console.log('🔒 Salvando alterações...');

    // Fundamentos
    const foundationOriginal = foundationRef.current?.getOriginalList();
    const foundationCurrent = foundationRef.current?.getCurrentList();

    if (foundationOriginal && foundationCurrent) {
      await saveFoundationChanges(foundationOriginal, foundationCurrent);
      foundationRef.current.updateOriginalList();
    }

    // Materiais
    const materialOriginal = materialRef.current?.getOriginalList();
    const materialCurrent = materialRef.current?.getCurrentList();

    if (materialOriginal && materialCurrent) {
      await saveMaterialChanges(materialOriginal, materialCurrent);
      setTriggerLoad(prev => prev + 1);
    }


    // Montagem (Stitchbook)
    const stitchbookOriginal = stitchbookRef.current?.getOriginalList();
    const stitchbookCurrent = stitchbookRef.current?.getCurrentList();

    if (stitchbookOriginal && stitchbookCurrent) {
      await saveStitchbookChanges(stitchbookOriginal, stitchbookCurrent);
      setTriggerLoad(prev => prev + 1);
    }


    

    setEditable(false);
  };

  return (
    <div>
      <Header />
      <br />

      <div className="data_body">
        <br />
        <p>
          <button className="button_title" onClick={() => (window.location.href = '/')}> Home </button>{" > "}
          <button className="button_title" onClick={() => (window.location.href = `/receita?id=${amigurumiId}`)}> Receita </button>
        </p>

        <button onClick={() => setEditable(prev => !prev)}>
          {editable ? 'Desligar Edição' : 'Ligar Edição'}
        </button>

        {editable && (
          <button onClick={handleSave}>
            Salvar
          </button>
        )}

        {editable && (
          <BotaoDeleteAmigurumi amigurumiId={amigurumiId} onDeleted={handleDeleted} />
        )}

        <br /><br />

        <>
        {editable && (
          <button onClick={() => setShowImageModal(true)}>
            Gerenciar Imagens
          </button>
        )}

        {showImageModal && (
          <SaveImageChanges amigurumiId={amigurumiId} onClose={() => setShowImageModal(false)} />
        )}
        <div id="full_amigurumi_data">
          <AmigurumiCards filteredData={filteredData} trigger={triggerLoad} editable={editable} redirection={false} />
          <div id="amigurumi_information"><h2>Dados</h2><FoundationList ref={foundationRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} /></div>
        </div>
        <br /><br /><br />
        <MaterialList ref={materialRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />
        <br /><br /><br />
        <div id="div_stitchbookList"><h2>Montagem</h2><Stitchbook ref={stitchbookRef} amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} /></div>
        
        <Relationship amigurumiId={amigurumiId} editable={editable} trigger={triggerLoad} />
      </>


        <br /><br />
      </div>

      <Footer />
    </div>
  );
}
