import * as API from './--api.js';

function addNewAmigurumi() {
    let overlay = document.createElement("div");
    overlay.id = "modalOverlayAmigurumi";
    document.body.appendChild(overlay);

    let modal = document.createElement("div");
    modal.id = "addNewAmigurumiBox";
    modal.innerHTML = `
        <h3>Adicionar um Novo Amigurumi</h3>
        <label>Nome: <input type="text" id="editName" required></label><br><br>
        <label>Autor: <input type="text" id="editAuthor" required></label><br><br>
        <label>Tamanho: <input type="number" id="editSize" required></label><br><br>
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
            filterAmigurumis()
        })
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById("cancelEdit").addEventListener("click", function () {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    })
}


function filterAmigurumis() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    API.APIGet_FoundationList()
        .then(data => {
            const cardAmigurumi = document.getElementById("cardAmigurumi");
            cardAmigurumi.innerHTML = "";
            
            let filteredData = data.filter(row => row.amigurumi_id_of_linked_amigurumi == "");

            if (searchQuery) {
                filteredData = data.filter(row => row.name.toLowerCase().includes(searchQuery) && row.amigurumi_id_of_linked_amigurumi == "");
            }

            if (filteredData.length === 0 && searchQuery) {
                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = "Nenhum resultado encontrado. Tente outra busca!";
                noResultsMessage.style.textAlign = "center";
                cardAmigurumi.appendChild(noResultsMessage);
            }

            filteredData.forEach(amigurumi => {
                const card = document.createElement("div");
                card.className = "cardAmigurumi";

                API.APIGet_Image()
                    .then(imageData => {
                        const imageSrcArray = imageData
                            .filter(row => row.amigurumi_id == amigurumi.amigurumi_id)
                            .map(row => row.image_route); 
                        
                        let currentIndex = 0;

                        const imageElement = document.createElement('img');
                        imageElement.src = `http://localhost:8000/${imageSrcArray[currentIndex]}`
                        imageElement.alt = amigurumi.name;
                        imageElement.id = "cardAmigurumiImage";

                        function showNextImage() {
                            currentIndex = (currentIndex + 1) % imageSrcArray.length;
                            imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`
                        }

                        function showPreviousImage() {
                            currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                            imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`
                        }

                        const nextButton = document.createElement('button_next_previous');
                        nextButton.innerText = ">";
                        nextButton.addEventListener('click', showNextImage);
                        
                        const prevButton = document.createElement('button_next_previous');
                        prevButton.innerText = "<";
                        prevButton.addEventListener('click', showPreviousImage);

                        const titleElement = document.createElement('h3');
                        titleElement.textContent = amigurumi.name;

                        const link = document.createElement('a');
                        link.href = `_receita.html?id=${amigurumi.amigurumi_id}`;
                        link.textContent = 'Ver Mais';

                        card.appendChild(titleElement);
                        card.appendChild(imageElement);
                        card.appendChild(prevButton);
                        card.appendChild(nextButton);
                        card.appendChild(link);

                        cardAmigurumi.appendChild(card);
                    })
            });
        })
}





document.addEventListener("DOMContentLoaded", () => {filterAmigurumis()});

document.getElementById("add_new_amigurumi").addEventListener("click", addNewAmigurumi);
