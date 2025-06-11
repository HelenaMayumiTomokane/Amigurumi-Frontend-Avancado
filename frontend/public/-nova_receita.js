// aba destinada para agrupar todas as funções utilizadas pela adição de uma nova receita

import * as API from './--support_code.js';

//Requsição para acionamento do código de adição de um novo amigurumi
function addNewAmigurumi() {
    const relationship = null
    API.addNewAmigurumiFoundation(relationship)
}






//acionamento por ação
document.getElementById("add_new_amigurumi").addEventListener("click", addNewAmigurumi);