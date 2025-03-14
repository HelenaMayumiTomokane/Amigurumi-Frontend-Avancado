var urlParams = new URLSearchParams(window.location.search);
var amigurumiId = urlParams.get("id").split("?")[0];

// ------------------ tabela de Stitchbook -------------------------- \\

function loadStitchbookTable() {
    fetch(`http://127.0.0.1:5000/stitchbook`)
        .then(response => response.json())
        .then(data => {
            const stitchbookList = document.getElementById("data_stitchbookList");
            stitchbookList.innerHTML = "";

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = urlParams.get("id").split("?")[0];

            data
            .filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId))
            .forEach(row => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td><input type="text" name="element" value="${row.element || ""}"></td>
                    <td><input type="text" name="colour" value="${row.colour || ""}"></td>
                    <td><input type="number" name="number_row" value="${row.number_row || ""}"></td>
                    <td><input type="text" name="stich_sequence" value="${row.stich_sequence || ""}"></td>
                    <td><input type="text" name="observation" value="${row.observation || ""}"></td>
                    <td>
                        <button class="btn-edit" data-id="${row.line_id}">Alterar no BD</button>
                        <button class="btn-remove" data-id="${row.line_id}">Deletar no BD</button>
                    </td>
                `;

                const removeButton = tr.querySelector(".btn-remove");
                const editButton = tr.querySelector(".btn-edit");

                removeButton.addEventListener("click", function () {
                    const stitchbookIdDelete = this.getAttribute("data-id");

                    fetch(`http://127.0.0.1:5000/stitchbook/line_id`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "line_id": stitchbookIdDelete
                        })
                    })
                    .then(response => response.json())
                    .then(data => alert(data.message))
                    .then(() => loadStitchbookTable())
                });

                editButton.addEventListener("click", function () {
                    const stitchbookIdPut = this.getAttribute("data-id");

                    const element = tr.querySelector('input[name="element"]').value;
                    const number_row = tr.querySelector('input[name="number_row"]').value;
                    const colour = tr.querySelector('input[name="colour"]').value;
                    const stich_sequence = tr.querySelector('input[name="stich_sequence"]').value;
                    const observation = tr.querySelector('input[name="observation"]').value;

                    fetch(`http://127.0.0.1:5000/stitchbook/line_id`, { 
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            "line_id": stitchbookIdPut,
                            "amigurumi_id": amigurumiId,
                            "observation": observation,
                            "element": element,
                            "number_row": number_row,
                            "colour": colour,
                            "stich_sequence": stich_sequence
                        })
                    })
                    .then(response => response.json())
                    .then(data => alert(data.message))
                    .then(() => loadStitchbookTable())
                    
                });

                stitchbookList.appendChild(tr);
            });
        });
}

function addRowOldTable() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    const table = document.getElementById("table_stitchbookList").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="text" name="element" required></td>
        <td><input type="number" name="number_row" required></td>
        <td><input type="text" name="colour" required></td>
        <td><input type="text" name="stich_sequence" required></td>
        <td><input type="text" name="observation" required></td>
        <td>
            <button class="add-btn">Adicionar no BD</button>
            <button onclick="removeRow(this)" class="delete-btn">Remover Linha</button>
        </td>
    `;

    const addButton = newRow.querySelector(".add-btn");

    addButton.addEventListener("click", function() {
        const element = newRow.querySelector('input[name="element"]').value;
        const number_row = newRow.querySelector('input[name="number_row"]').value;
        const colour = newRow.querySelector('input[name="colour"]').value;
        const stich_sequence = newRow.querySelector('input[name="stich_sequence"]').value;
        const observation = newRow.querySelector('input[name="observation"]').value;


        fetch("http://127.0.0.1:5000/stitchbook", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "amigurumi_id": amigurumiId ,
                "observation": observation,
                "element": element,
                "number_row": number_row,
                "colour": colour,
                "stich_sequence": stich_sequence
            })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .then(() => loadStitchbookTable())
    });
}

function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

document.addEventListener("DOMContentLoaded", loadStitchbookTable);




// ------------------ tabela de Imagem -------------------------- \\
function loadImagemTable(){
    fetch(`http://127.0.0.1:5000/image`)
        .then(image_result => image_result.json())
        .then(imageData => {
            const container = document.getElementById("cardAmigurumiRecipeImage");
            container.innerHTML = "";

            const filteredImages = imageData
                .filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId));

            if (filteredImages.length === 0) return;

            filteredImages.sort((a, b) => b.main_image - a.main_image);

            const imageSrcArray = filteredImages.map(row => row.image_route);

            let currentIndex = 0;

            const imageElement = document.createElement('img');
            imageElement.src = imageSrcArray[currentIndex];
            imageElement.id = "amigurumiRecipeImageDisplay";

            function showNextImage() {
                currentIndex = (currentIndex + 1) % imageSrcArray.length;
                imageElement.src = imageSrcArray[currentIndex];
            }

            function showPreviousImage() {
                currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                imageElement.src = imageSrcArray[currentIndex];
            }

            const nextButton = document.createElement('button');
            nextButton.innerText = ">";
            nextButton.onclick = showNextImage;

            const prevButton = document.createElement('button');
            prevButton.innerText = "<";
            prevButton.onclick = showPreviousImage;

            container.appendChild(imageElement);
            container.appendChild(prevButton);
            container.appendChild(nextButton);
        });

}


function createImageEditBox() {
    if (document.getElementById("editImageBox")) {
        return; 
    }

    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    fetch(`http://127.0.0.1:5000/image`)
        .then(response => response.json())
        .then(data => {
            let overlay = document.createElement("div");
            overlay.id = "modalOverlayImage";
            document.body.appendChild(overlay);

            let modal = document.createElement("div");
            modal.id = "editImageBox";

            modal.innerHTML = `
                <h3>Adicionar ou Excluir Imagem do Amigurumi</h3>
                <label>URL da Imagem: <input type="url" id="editImageUrl" placeholder="Cole a URL da imagem"></label><br><br>
                <label>Observação: <input type="text" id="editImageObs" placeholder="Adicione uma observação"></label><br><br>
                <label>Imagem Principal: <input type="checkbox" id="editImagePrincipal"></label><br><br>

                <button id="saveImageEdit">Salvar</button>
                <button id="cancelImageEdit" class="cancel-btn">Cancelar</button>
                <hr>
                <h4>Imagens Existentes</h4>
                <ul id="imageList">
                    ${data
                        .filter(row=> parseInt(row.amigurumi_id) === parseInt(amigurumiId))
                        .map(image => `
                        <li>
                            <img src="${image.image_route}" alt="Imagem" style="max-width: 100px; height: auto; margin-right: 10px;">
                            <span>${image.observation}</span>
                            <span>${image.main_image}</span>
                            <button class="deleteImageBtn" data-id="${image.image_id}">Excluir</button>
                        </li>
                    `).join('')}
                </ul>
            `;

            document.body.appendChild(modal);

            document.getElementById("saveImageEdit").addEventListener("click", function () {
                let newImageData = {
                    main_image: document.getElementById("editImagePrincipal").value == "on"? true: false,
                    image_route: document.getElementById("editImageUrl").value,
                    observation: document.getElementById("editImageObs").value,
                    amigurumi_id: amigurumiId,
                };

                fetch(`http://127.0.0.1:5000/image`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newImageData)
                })
                .then(response => response.json())
                .then(data => alert(data.message))
                .then(() => loadImagemTable())

                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            document.getElementById("cancelImageEdit").addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            const deleteBtns = document.querySelectorAll('.deleteImageBtn');
            deleteBtns.forEach(btn => {
                btn.addEventListener("click", function() {
                    const imageId = btn.getAttribute("data-id");

                    fetch(`http://127.0.0.1:5000/image/image_id`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "image_id": imageId
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message)
                        loadImagemTable()
                        btn.parentElement.remove();
                    })
                });
            });
        })
}

document.getElementById("amigurumi_image_edit").addEventListener("click", createImageEditBox);

document.addEventListener("DOMContentLoaded", loadImagemTable);



// ------------------ tabela de Lista de Materiais -------------------------- \\
function loadMaterialTable(){
    fetch(`http://127.0.0.1:5000/material_list`)
        .then(response => response.json())
        .then(data => {
            let listContainer = document.getElementById("data_amigurumi_material");
            listContainer.innerHTML = "";

            let title = document.createElement("h2");
            title.innerHTML = "Lista de Materiais";
            listContainer.appendChild(title);

            let ul = document.createElement("ul");

            data
            .filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId))
            .forEach(material => {
                let li = document.createElement("li");

                li.innerHTML = `
                    <input type="text" name="material" value="${material.material}">
                    <input type="number" name="quantity" value="${material.quantity}" min="0">
                    <input type="text" name="unit" value="${material.unit}">
                    <button class="btn-save" data-id="${material.material_list_id}">Alterar</button>
                    <button class="btn-remove" data-id="${material.material_list_id}">Remover</button>
                `;

                ul.appendChild(li);

                let saveButton = li.querySelector(".btn-save");
                saveButton.addEventListener("click", function () {
                    let materialId = this.getAttribute("data-id");
                    let updatedMaterial = li.querySelector('input[name="material"]').value;
                    let updatedQuantity = li.querySelector('input[name="quantity"]').value;
                    let updatedUnit = li.querySelector('input[name="unit"]').value;

                    fetch(`http://127.0.0.1:5000/material_list/material_list_id`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "material_list_id":materialId,
                            "material": updatedMaterial,
                            "quantity": updatedQuantity,
                            "unit": updatedUnit
                        })
                    })
                    .then(response => response.json())
                    .then(result => alert("Material atualizado com sucesso!"))
                    .catch(error => alert("Erro ao atualizar material."));
                });

                let removeButton = li.querySelector(".btn-remove");
                removeButton.addEventListener("click", function () {
                    let materialId = this.getAttribute("data-id");

                    fetch(`http://127.0.0.1:5000/material_list/material_list_id`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            "material_list_id":materialId
                        })
                    })
                    .then(response => response.json())
                    .then(data => alert(data.message))
                    .then(() => li.remove())
                });
            });

            listContainer.appendChild(ul);
    });
}

function addRowMaterialTable() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    const table = document.getElementById("table_amigurumi_material").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="text" name="material" required></td>
        <td><input type="number" name="quantity" required min="0"></td>
        <td><input type="text" name="unit" required></td>
        <td>
            <button class="addMaterial-btn">Adicionar no BD</button>
            <button onclick="removeRow(this)" class="deleteMaterial-btn">Remover Linha</button>
        </td>
    `;

    const addButton = newRow.querySelector(".addMaterial-btn");

    addButton.addEventListener("click", function() {
        const material = newRow.querySelector('input[name="material"]').value;
        const quantity = newRow.querySelector('input[name="quantity"]').value;
        const unit = newRow.querySelector('input[name="unit"]').value;

        fetch("http://127.0.0.1:5000/material_list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "amigurumi_id": amigurumiId,
                "material": material,
                "quantity": quantity,
                "unit": unit
            })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .then(() => loadMaterialTable())
    });
}

document.addEventListener("DOMContentLoaded", loadMaterialTable);



// ------------------ tabela de Dados Básicos -------------------------- \\
function loadInformatianAmigurumi(){
    fetch(`http://127.0.0.1:5000/foundation_list`)
        .then(response => response.json())
        .then(data => {
            data
            .filter(row=> parseInt(row.amigurumi_id) == parseInt(amigurumiId))
            .forEach(foundation_list => {

                const amigumi_name = document.getElementById("amigurmi_name_recipe")
                amigumi_name.textContent = foundation_list.name

                const amigumi_size = document.getElementById("amigurmi_name_size")
                amigumi_size.textContent = "Tamanho: " + foundation_list.size;

                const amigumi_autor = document.getElementById("amigurmi_name_autor")
                amigumi_autor.textContent = "Criador: " + foundation_list.autor;
            });
    })

}

document.addEventListener("DOMContentLoaded", loadInformatianAmigurumi);



function createEditBox() {
    if (document.getElementById("editAmigurumiBox")) {
        return;
    }

    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    fetch(`http://127.0.0.1:5000/foundation_list`)
        .then(response => response.json())
        .then(data => {
            const amigurumiData = data.find(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId));

            if (!amigurumiData) {
                alert("Amigurumi não encontrado!");
                return;
            }

            let overlay = document.createElement("div");
            overlay.id = "modalOverlayAmigurumi";
            document.body.appendChild(overlay);

            let modal = document.createElement("div");
            modal.id = "editAmigurumiBox";

            modal.innerHTML = `
                <h3>Editar Amigurumi</h3>
                <label>Nome: <input type="text" id="editName" value="${amigurumiData.name}"></label><br><br>
                <label>Autor: <input type="text" id="editAuthor" value="${amigurumiData.autor}"></label><br><br>
                <label>Tamanho: <input type="number" id="editSize" value="${amigurumiData.size}"></label><br><br>
                <label>Link: <input type="url" id="editLink" value="${amigurumiData.link}"></label><br><br>
                <label>ID Amigurumi Vinculado: <input type="number" id="editLinkedId" value="${amigurumiData.amigurumi_id_of_linked_amigurumi}"></label><br><br>
                <label>Observação: <input type="text" id="editObs" value="${amigurumiData.obs}"></label><br><br>
                <button id="saveEdit">Salvar</button>
                <button id="cancelEdit">Cancelar</button>
            `;

            document.body.appendChild(modal);

            document.getElementById("saveEdit").addEventListener("click", function () {
                let updatedData = {
                    amigurumi_id: amigurumiId,
                    name: document.getElementById("editName").value,
                    autor: document.getElementById("editAuthor").value,
                    size: document.getElementById("editSize").value,
                    link: document.getElementById("editLink").value,
                    amigurumi_id_of_linked_amigurumi: document.getElementById("editLinkedId").value,
                    obs: document.getElementById("editObs").value
                };

                fetch(`http://127.0.0.1:5000/foundation_list/amigurumi_id`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData)
                })
                .then(response => response.json())
                .then(data => alert(data.message))
                .then(() => {
                    loadMaterialTable();
                    loadInformatianAmigurumi();
                })

                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            document.getElementById("cancelEdit").addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });
        })
}

document.getElementById("amigurumi_edit").addEventListener("click", createEditBox);

function deleteAmigurumi(){
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0]

    fetch(`http://127.0.0.1:5000/foundation_list/amigurumi_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": amigurumiId
        })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .then(() => {
        window.location.href = "_amigurumi.html";
    })
}

document.getElementById("delete_amigurumi").addEventListener("click", deleteAmigurumi);



// ------------------ Card de Novas Receitas -------------------------- \\
fetch(`http://127.0.0.1:5000/foundation_list`)
    .then(response => response.json())
    .then(data => {
        const cardAmigurumi = document.getElementById("cardAmigurumi");
        cardAmigurumi.innerHTML = "";

        const filteredData = data.filter(row => parseInt(row.amigurumi_id_of_linked_amigurumi) === parseInt(amigurumiId));

        if (filteredData.length === 0) {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = "Parece que não encontramos nada relacionado a esse item. Não desanime! Tente explorar outras opções incríveis!";
            cardAmigurumi.appendChild(noResultsMessage);
        } else {
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
        }
    })


document.addEventListener("DOMContentLoaded", loadInformatianAmigurumi);
