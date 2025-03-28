import * as API from './--support_code.js';

function addNewAmigurumi() {
    if (document.getElementById("addNewAmigurumiBox")) {
        return;
    }

    let overlay = document.createElement("div");
    overlay.id = "modalOverlayAmigurumi";
    document.body.appendChild(overlay);

    let modal = document.createElement("div");
    modal.id = "addNewAmigurumiBox";
    modal.innerHTML = `
        <h3>Adicionar um Novo Amigurumi</h3>
        <label>Nome*: <input type="text" id="editName" required></label><br><br>
        <label>Autor*: <input type="text" id="editAuthor" required></label><br><br>
        <label>Tamanho*: <input type="number" id="editSize" required></label><br><br>
        <label>Link: <input type="url" id="editLink" required></label><br><br>
        <label>Observação: <input type="text" id="editObs"></label><br><br>
        <button id="saveEdit">Salvar</button>
        <button id="cancelEdit">Cancelar</button>
    `;

    document.body.appendChild(modal);

    document.getElementById("saveEdit").addEventListener("click", function () {

        const nameAmigurumi = document.getElementById("editName").value
        const autorAmigurumi =  document.getElementById("editAuthor").value
        const sizeAmigurumi = parseInt(document.getElementById("editSize").value)
        const linkAmigurumi =  document.getElementById("editLink").value
        const amigurumi_id_of_linked_amigurumiAmigurumi =  ""
        const obsAmigurumi =  document.getElementById("editObs").value
        

        API.APIPost_FoundationList(nameAmigurumi,autorAmigurumi,sizeAmigurumi,linkAmigurumi,amigurumi_id_of_linked_amigurumiAmigurumi,obsAmigurumi)
        .then(data => {
            alert(data.message)
            allAmigurumiAvailable()
        })
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById("cancelEdit").addEventListener("click", function () {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    })
}


function allAmigurumiAvailable() {
    API.APIGet_FoundationList()
        .then(data => {
            const cardID = "cardAmigurumi"            
            let filteredData = data.filter(row => row.amigurumi_id_of_linked_amigurumi == "");

            API.createAmigurumiImageCard(cardID, filteredData)
        })
}


function filterAmigurumis() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    API.APIGet_FoundationList()
        .then(data => {
            const cardID = "cardAmigurumi"
            
            let filteredData = data.filter(row => row.amigurumi_id_of_linked_amigurumi == "");

            if (filteredData.length > 0 && searchQuery) {
                filteredData = data.filter(row => row.name.toLowerCase().includes(searchQuery) && row.amigurumi_id_of_linked_amigurumi == "");
            }

            if (filteredData.length === 0 && searchQuery) {
                const cardAmigurumi = document.getElementById(cardID);
                cardAmigurumi.innerHTML = "";
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = 'Nenhum resultado encontrado. Tente outra busca ou limpe a barra de pesquisa, e clique novamente em "Pesquisar" para voltar ao início!';
                noResultsMessage.style.textAlign = "center";
                cardAmigurumi.appendChild(noResultsMessage);
            }

           
            API.createAmigurumiImageCard(cardID, filteredData)
            
        })
}




document.addEventListener("DOMContentLoaded", () => {
    allAmigurumiAvailable()
});

document.getElementById("add_new_amigurumi").addEventListener("click", addNewAmigurumi);
document.getElementById("search_amigurumi").addEventListener("click", filterAmigurumis);


