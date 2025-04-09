// aba destinada para agrupar todas as funções utilizadas pela página Amigurumi Principal

import * as API from './--support_code.js';

//Requsição para acionamento do código de adição de um novo amigurumi
function addNewAmigurumi() {
    const relationship = null
    API.addNewAmigurumiFoundation(relationship)
}

//Requsição para acionamento do código de criação de card dos amigurumis principais
function allAmigurumiAvailable() {
    API.APIGet_FoundationList()
        .then(data => {
            const cardID = "cardAmigurumi"            
            let filteredData = data.filter(row => row.relationship == "" || row.relationship == null);

            API.createAmigurumiImageCard(cardID, filteredData)
        })
}

//filtro de amigurumi
function filterAmigurumis() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    API.APIGet_FoundationList()
        .then(data => {
            const cardID = "cardAmigurumi"
            
            let filteredData = data.filter(row => row.relationship == "" || row.relationship == null);

            if (filteredData.length > 0 && searchQuery) {
                filteredData = data.filter(row => row.name.toLowerCase().includes(searchQuery) && row.relationship == "");
            }

            if (filteredData.length === 0 && searchQuery) {
                const cardAmigurumi = document.getElementById(cardID);
                cardAmigurumi.innerHTML = "";
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = 'Nenhum resultado encontrado. Tente outra busca ou limpe a barra de pesquisa, e clique novamente em "Pesquisar" para voltar ao início!';
                noResultsMessage.style.textAlign = "center";
                cardAmigurumi.appendChild(noResultsMessage);
            }  

            //Requsição para acionamento do código de criação de card dos amigurumis principais
            API.createAmigurumiImageCard(cardID, filteredData)
            
        })
}


//acionamento instantâneo de todas as tabelas e dados
document.addEventListener("DOMContentLoaded", () => {
    allAmigurumiAvailable()
});


//acionamento por ação
document.getElementById("add_new_amigurumi").addEventListener("click", addNewAmigurumi);
document.getElementById("search_amigurumi").addEventListener("click", filterAmigurumis);


