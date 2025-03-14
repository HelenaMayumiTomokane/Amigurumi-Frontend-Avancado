function filterAmigurumis() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();
    fetch(`http://127.0.0.1:5000/foundation_list`)
        .then(response => response.json())
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

                fetch('http://127.0.0.1:5000/image')
                    .then(image_result => image_result.json()) 
                    .then(imageData => {
                        const imageSrcArray = imageData
                            .filter(row => row.amigurumi_id == amigurumi.amigurumi_id)
                            .map(row => row.image_route); 

                        let currentIndex = 0;

                        const imageElement = document.createElement('img');
                        imageElement.src = imageSrcArray[currentIndex];
                        imageElement.alt = amigurumi.name;
                        imageElement.id = "cardAmigurumiImage";

                        function showNextImage() {
                            currentIndex = (currentIndex + 1) % imageSrcArray.length;
                            imageElement.src = imageSrcArray[currentIndex];
                        }

                        function showPreviousImage() {
                            currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                            imageElement.src = imageSrcArray[currentIndex];
                        }

                        const nextButton = document.createElement('button_next_previous');
                        nextButton.innerText = ">";
                        nextButton.onclick = showNextImage;

                        const prevButton = document.createElement('button_next_previous');
                        prevButton.innerText = "<";
                        prevButton.onclick = showPreviousImage;

                        const titleElement = document.createElement('h3');
                        titleElement.textContent = amigurumi.name;

                        const link = document.createElement('a');
                        link.href = `_receita.html?id=${amigurumi.amigurumi_id}?name=${amigurumi.name}`;
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

document.addEventListener("DOMContentLoaded", filterAmigurumis);



// ------------------ Adicionar Novo Amigurumi -------------------------- \\

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
        <h3>Adicionar Novo Amigurumi</h3>
        <label>Nome: <input type="text" id="editName" required></label><br><br>
        <label>Autor: <input type="text" id="editAuthor" required></label><br><br>
        <label>Tamanho: <input type="number" id="editSize" required></label><br><br>
        <label>Link: <input type="url" id="editLink" required></label><br><br>
        <label>ID Amigurumi Vinculado: <input type="number" id="editLinkedId" required></label><br><br>
        <label>Observação: <input type="text" id="editObs"></label><br><br>
        <button id="saveEdit">Salvar</button>
        <button id="cancelEdit">Cancelar</button>
    `;

    document.body.appendChild(modal);

    document.getElementById("saveEdit").addEventListener("click", function () {
        let newAmigurumiData = {
            name: document.getElementById("editName").value,
            autor: document.getElementById("editAuthor").value,
            size: parseInt(document.getElementById("editSize").value),
            link: document.getElementById("editLink").value,
            amigurumi_id_of_linked_amigurumi: document.getElementById("editLinkedId").value,
            obs: document.getElementById("editObs").value
        };

        fetch(`http://127.0.0.1:5000/foundation_list`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAmigurumiData)
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .then(() => filterAmigurumis())

        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById("cancelEdit").addEventListener("click", function () {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    })
}

document.getElementById("add_new_amigurumi").addEventListener("click", addNewAmigurumi);



