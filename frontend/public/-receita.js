import * as API from './--api.js';

var urlParams = new URLSearchParams(window.location.search);
var amigurumiId = urlParams.get("id").split("?")[0];

// ------------------ Construção dos Dados -------------------------- \\

function loadStitchbookTable() {
    API.APIGet_Stitchbook()
        .then(data => {
            const stitchbookList = document.getElementById("data_stitchbookList");
            stitchbookList.innerHTML = "";

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = urlParams.get("id").split("?")[0];

            const filteredData = data.filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId));

            const groupedData = filteredData.reduce((acc, row) => {
                if (!acc[row.element_id]) {
                    acc[row.element_id] = [];
                }
                acc[row.element_id].push(row);
                return acc;
            }, {});

            const sortedElementIds = Object.keys(groupedData).sort((a, b) => {
                const elementOrderA = groupedData[a][0].element_order;
                const elementOrderB = groupedData[b][0].element_order;
                return elementOrderA - elementOrderB; // Ordem crescente, para decrescente troque para `b - a`
            });

            sortedElementIds.forEach(element_id => {

                const tableContainer = document.createElement("div");
                tableContainer.classList.add("table-container");

                const elementName = groupedData[element_id][0].element_name;
                const quantity = groupedData[element_id][0].quantity;

                const tableTitle = document.createElement("h1");
                tableTitle.classList.add("table-title");
                tableTitle.textContent = `${elementName} x${quantity}`;
                tableContainer.appendChild(tableTitle);

                const table = document.createElement("table");
                table.classList.add("stitchbook-table");

                tableContainer.appendChild(table);

                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Carreira</th>
                            <th>Cor</th>
                            <th>Sequência de Ponto</th>
                            <th>Observação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupedData[element_id].map(row => `
                            <tr data-id="${row.line_id}">
                                <td name="number_row">${row.number_row || ""}</td>
                                <td name="colour">${row.colour || ""}</td>
                                <td name="stich_sequence">${row.stich_sequence || ""}</td>
                                <td name="observation">${row.observation || ""}</td>
                                <td>
                                    <button class="btn-edit" alteration_botton_id="${row.line_id}">Alterar</button>
                                    <button class="btn-remove" delete_botton_id="${row.line_id}">Deletar</button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                    <br>
                    <button class="add_stitchbook">Adicionar Pontos</button>
                    <br>
                    <br>
                `;

                stitchbookList.appendChild(tableContainer);

                const removeButton = table.querySelectorAll(".btn-remove");
                const addRowButton = table.querySelector(".add_stitchbook");
                const alterButton = table.querySelectorAll(".btn-edit");

                removeButton.forEach(row => {
                    row.addEventListener("click", function () {
                        const stitchbookIdDelete = this.getAttribute("delete_botton_id");
                        API.APIDelete_Stitchbook(stitchbookIdDelete)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookTable();
                            });
                    });
                });

                alterButton.forEach(editButton => {
                    editButton.addEventListener("click", function () {
                        const stitchbookIdPut = this.getAttribute("alteration_botton_id");
                        const tr = this.closest("tr");
                        const originalValues = {};

                        const removeButton = tr.querySelector(".btn-remove");
                        const alterButton = tr.querySelector(".btn-edit");
                        removeButton.style.display = "none";
                        alterButton.style.display = "none";

                        ["number_row", "colour", "stich_sequence", "observation"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            originalValues[name] = cell.textContent.trim();
                            cell.innerHTML = `<input type="text" name="${name}" value="${originalValues[name]}">`;
                        });

                        let saveButton = document.createElement("button");
                        saveButton.textContent = "Salvar";
                        saveButton.classList.add("btn-save");
                        tr.querySelector("td:last-child").appendChild(saveButton);


                        let cancelButton = document.createElement("button");
                        cancelButton.textContent = "Cancelar";
                        cancelButton.classList.add("btn-cancel");
                        tr.querySelector("td:last-child").appendChild(cancelButton);

                        cancelButton.addEventListener("click", function () {
                            cancelButton.remove();
                            saveButton.remove();

                            ["number_row", "colour", "stich_sequence", "observation"].forEach(name => {
                                let cell = tr.querySelector(`[name="${name}"]`);
                                cell.innerHTML = originalValues[name];
                            });

                            removeButton.style.display = "inline-block";
                            alterButton.style.display = "inline-block";
                        });

                        saveButton.addEventListener("click", function () {
                            const number_row = tr.querySelector('input[name="number_row"]').value;
                            const colour = tr.querySelector('input[name="colour"]').value;
                            const stich_sequence = tr.querySelector('input[name="stich_sequence"]').value;
                            const observation = tr.querySelector('input[name="observation"]').value;

                            API.APIPut_Stitchbook(stitchbookIdPut, amigurumiId, observation, element_id, number_row, colour, stich_sequence)
                                .then(data => {
                                    alert(data.message);
                                    loadStitchbookTable();
                                })
                        });
                    });
                });

                addRowButton.addEventListener("click", function () {
                    const newRow = table.insertRow();
                    const lastRow = table.rows[table.rows.length - 2];
                    let lastRowData = {
                        number_row: lastRow.querySelector('td[name="number_row"]')?.textContent || '',
                        colour: lastRow.querySelector('td[name="colour"]')?.textContent || '',
                        stich_sequence: lastRow.querySelector('td[name="stich_sequence"]')?.textContent || '',
                    };

                    newRow.innerHTML = `
                        <td><input type="number" name="number_row" value="${parseInt(lastRowData.number_row) + 1}" required></td>
                        <td><input type="number" name="colour" value="${lastRowData.colour}" required></td>
                        <td><input type="text" name="stich_sequence" value="${lastRowData.stich_sequence}" required></td>
                        <td><input type="text" name="observation" required></td>
                        <td id="manual_fit_stitchbook">
                            <button class="addStitch-btn">Adicionar</button>
                            <button class="deleteStitch-btn">Remover</button>
                        </td>
                    `;

                    const addButton = newRow.querySelector(".addStitch-btn");
                    const deleteButton = newRow.querySelector(".deleteStitch-btn");

                    addButton.addEventListener("click", function () {
                        const number_row = newRow.querySelector('input[name="number_row"]').value;
                        const colour = newRow.querySelector('input[name="colour"]').value;
                        const stich_sequence = newRow.querySelector('input[name="stich_sequence"]').value;
                        const observation = newRow.querySelector('input[name="observation"]').value;

                        API.APIPost_Stitchbook(amigurumiId, element_id, number_row, colour, stich_sequence, observation)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookTable();
                            });
                    });

                    deleteButton.addEventListener("click", function () {
                        newRow.remove();
                    });
                });
            
            });
        });
}

// ------------------ Stitchbook Element -------------------------- \\

function loadStitchbookSequenceTable() {
    API.APIGet_Stitchbook_Sequence()
        .then(data => {
            const sequenceList = document.getElementById("table_stitchbook_sequence");
            sequenceList.innerHTML = "";

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = urlParams.get("id").split("?")[0];

            const filteredData = data.filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId));

            const table = document.createElement("table");
            table.classList.add("stitchbook-sequence-table");

            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Elemento</th>
                        <th>Ordem</th>
                        <th>Qtde</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredData.map(row => `
                        <tr data-id="${row.element_id}">
                            <td name="element_name">${row.element_name || ""}</td>
                            <td name="element_order">${row.element_order || ""}</td>
                            <td name="quantity">${row.quantity || ""}</td>
                            <td>
                                <button class="btn-edit" alteration_botton_id="${row.element_id}">Alterar</button>
                                <button class="btn-remove" delete_botton_id="${row.element_id}">Deletar</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
                <br>
                <button class="add_stitchbook_sequence">Adicionar Elemento</button>
                <br>
                <br>
            `;

            sequenceList.appendChild(table);

            // Remover elemento
            table.querySelectorAll(".btn-remove").forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = this.getAttribute("delete_botton_id");

                    API.APIDelete_Stitchbook_Sequence(elementId)
                        .then(data => {
                            alert(data.message);
                            loadStitchbookSequenceTable();
                            loadStitchbookTable();
                        });
                });
            });

            // Editar elemento
            table.querySelectorAll(".btn-edit").forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = this.getAttribute("alteration_botton_id");
                    const tr = this.closest("tr");
                    const originalValues = {};

                    const removeButton = tr.querySelector(".btn-remove");
                    const alterButton = tr.querySelector(".btn-edit");
                    removeButton.style.display = "none";
                    alterButton.style.display = "none";

                    ["element_name", "element_order","quantity"].forEach(name => {
                        let cell = tr.querySelector(`[name="${name}"]`);
                        originalValues[name] = cell.textContent.trim();
                        cell.innerHTML = `<input type="text" name="${name}" value="${originalValues[name]}">`;
                    });

                    let saveButton = document.createElement("button");
                    saveButton.textContent = "Salvar";
                    saveButton.classList.add("btn-save");
                    tr.querySelector("td:last-child").appendChild(saveButton);

                    let cancelButton = document.createElement("button");
                    cancelButton.textContent = "Cancelar";
                    cancelButton.classList.add("btn-cancel");
                    tr.querySelector("td:last-child").appendChild(cancelButton);

                    cancelButton.addEventListener("click", function () {
                        cancelButton.remove();
                        saveButton.remove();

                        ["element_name", "element_order","quantity"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            cell.innerHTML = originalValues[name];
                        });

                        removeButton.style.display = "inline-block";
                        alterButton.style.display = "inline-block";
                    });

                    saveButton.addEventListener("click", function () {
                        const element_name = tr.querySelector('input[name="element_name"]').value;
                        const element_order = tr.querySelector('input[name="element_order"]').value;
                        const quantity = tr.querySelector('input[name="quantity"]').value;

                        API.APIPut_Stitchbook_Sequence(elementId, amigurumiId, element_name, element_order,quantity)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookSequenceTable();
                                loadStitchbookTable();
                            });
                    });
                });
            });

            // Adicionar novo elemento
            table.querySelector(".add_stitchbook_sequence").addEventListener("click", function () {
                const newRow = table.insertRow();
                newRow.innerHTML = `
                    <td><input type="text" name="element_name" required></td>
                    <td><input type="number" name="element_order" required></td>
                    <td><input type="number" name="quantity" required></td>
                    <td id="manual_fit_stitchbook">
                        <button class="addStitchSequence-btn">Adicionar</button>
                        <button class="deleteStitchSequence-btn">Remover</button>
                    </td>
                `;

                const addButton = newRow.querySelector(".addStitchSequence-btn");
                const deleteButton = newRow.querySelector(".deleteStitchSequence-btn");

                addButton.addEventListener("click", function () {
                    const element_name = newRow.querySelector('input[name="element_name"]').value;
                    const element_order = newRow.querySelector('input[name="element_order"]').value;
                    const quantity = newRow.querySelector('input[name="quantity"]').value;

                    API.APIPost_Stitchbook_Sequence(amigurumiId, element_name, element_order,quantity)
                        .then(data => {
                            alert(data.message);
                            loadStitchbookSequenceTable();
                            loadStitchbookTable();
                        });
                });

                deleteButton.addEventListener("click", function () {
                    newRow.remove();
                });
            });
        })
}



// ------------------ tabela de Imagem -------------------------- \\
function loadImagemTable(){
    API.APIGet_Image()
        .then(imageData => {
            const container = document.getElementById("cardAmigurumiRecipeImage");
            container.innerHTML = "";

            const filteredImages = imageData
                .filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId));

            if (filteredImages.length === 0) return;

            const imageSrcArray = filteredImages.map(row => row.image_route);

            let currentIndex = 0;

            const imageElement = document.createElement('img');
            imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`;
            imageElement.id = "amigurumiRecipeImageDisplay";
  
            function showPreviousImage() {
                currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`;
            }
            
            function showNextImage() {
                currentIndex = (currentIndex + 1) % imageSrcArray.length;
                imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`;
            }
            
            const nextButton = document.createElement('button_next_previous');
            nextButton.innerText = ">";
            nextButton.addEventListener('click', showNextImage); 

            const prevButton = document.createElement('button_next_previous');
            prevButton.innerText = "<";
            prevButton.addEventListener('click', showPreviousImage);

            container.appendChild(imageElement);
            container.appendChild(prevButton);
            container.appendChild(nextButton);
        });

}


function createImageEditBox() {
    /*if (document.getElementById("editImageBox")) {
        return; 
    }*/

    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    API.APIGet_Image()
        .then(data => {
            let overlay = document.createElement("div");
            overlay.id = "modalOverlayImage";
            document.body.appendChild(overlay);

            let modal = document.createElement("div");
            modal.id = "editImageBox";

            modal.innerHTML = `
                <h3>Adicionar ou Excluir Imagem do Amigurumi</h3>
                <label>Selecione um arquivo: <input type="file" id="editImageFile" accept="image/*"></label><br><br>
                <label>Observação: <input type="text" id="editImageObs" placeholder="Adicione uma observação"></label><br><br>
                <label>Imagem Principal: <input type="checkbox" id="editImagePrincipal"></label><br><br>
                <br>
                <br>
                <button id="saveImageEdit">Adicionar</button>
                <button id="cancelImageEdit" class="cancel-btn">Cancelar</button>
                <br>
                <br>
                <br>
                <hr>
                <h4>Imagens Existentes</h4>
                <ul id="imageList">
                    ${data
                        .filter(row=> parseInt(row.amigurumi_id) === parseInt(amigurumiId))
                        .map(image => `
                        <li>
                            <img src= http://localhost:8000/${image.image_route} alt="Imagem"  width="200" height="auto">
                            <br>
                            <br>
                            <span>Imagem Principal: <input type="checkbox" name="main_image" ${image.main_image ? "checked" : ""}></span>
                            <br>
                            <span>Observação: <input type="text" name="observation" value="${image.observation}"></span>

                            <br>
                            <br>
                            <button class="btn-edit" data-id="${image.image_id}">Alterar</button>
                            <button class="deleteImageBtn" data-id="${image.image_id}">Deletar</button>
                            <hr>
                        </li>
                        <br>
                        <br>
                        <br>
                    `).join('')}
                </ul>
            `;

            document.body.appendChild(modal);

            document.getElementById("saveImageEdit").addEventListener("click", function () {

                const main_image = document.getElementById("editImagePrincipal").checked
                const image_route = document.getElementById("editImageFile").files[0]
                const observation = document.getElementById("editImageObs").value
                
                if (!image_route) {
                    alert("Por favor, selecione uma imagem.");
                    return;
                }

                const formData = new FormData();
                formData.append("main_image", main_image);
                formData.append("image_route", image_route);
                formData.append("observation", observation);
                formData.append("amigurumi_id", parseInt(amigurumiId));

                console.log(formData)
                API.APIPost_Image(formData)
                .then(data => {
                    alert(data.message)
                    loadImagemTable()
                    document.body.removeChild(modal);
                    document.body.removeChild(overlay);
                })
            });

            document.getElementById("cancelImageEdit").addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            const deleteBtns = document.querySelectorAll('.deleteImageBtn');
            deleteBtns.forEach(btn => {
                btn.addEventListener("click", function() {
                    const imageId = btn.getAttribute("data-id");

                    API.APIDelete_Image(imageId)
                    .then(data => {
                        alert(data.message)
                        loadImagemTable()
                        //btn.parentElement.remove();
                        document.body.removeChild(modal);
                        document.body.removeChild(overlay);
                    })

                    
                });
            });

            const edit_button = document.querySelectorAll('.btn-edit');
            edit_button.forEach(btn => {
                btn.addEventListener("click", function() {
                    const listItem = btn.closest("li");

                    const imageId = btn.getAttribute("data-id");
                    const observation = listItem.querySelector('input[name="observation"]').value;
                    const main_image = listItem.querySelector('input[name="main_image"]').checked;

                    API.APIPut_Image(imageId,observation,main_image,amigurumiId)
                    .then(data => {
                        alert(data.message)
                        loadImagemTable()
                        document.body.removeChild(modal);
                        document.body.removeChild(overlay);
                    })

                    
                    
                });
            });
        })
}







// ------------------ tabela de Lista de Materiais -------------------------- \\
function loadMaterialTable() {
    API.APIGet_MaterialList()
        .then(data => {
            let listContainer = document.getElementById("data_amigurumi_material");
            listContainer.innerHTML = "";

            let title = document.createElement("h2");
            title.textContent = "Lista de Materiais";
            listContainer.appendChild(title);

            let table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Material</th>
                        <th>Qtde</th>
                        <th>Unid</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;

            listContainer.appendChild(table);
            let tbody = table.querySelector("tbody");

            data
            .filter(row => parseInt(row.amigurumi_id) === parseInt(amigurumiId))
            .forEach(material => {
                let tr = document.createElement("tr");

                tr.innerHTML = `
                    <td name="material">${material.material}</td>
                    <td name="quantity">${material.quantity}</td>
                    <td name="unit">${material.unit}</td>
                    <td>
                        <button class="btn-edit" data-id="${material.material_list_id}">Alterar</button>
                        <button class="btn-remove" data-id="${material.material_list_id}">Remover</button>
                    </td>
                `;

                tbody.appendChild(tr); 

                let removeButton = tr.querySelector(".btn-remove");
                let editButton = table.querySelectorAll(".btn-edit")

                removeButton.addEventListener("click", function () {
                    let materialId = this.getAttribute("data-id");

                    API.APIDelete_MaterialList(materialId)
                    .then(data => {
                        alert(data.message);
                        loadMaterialTable()
                    });
                });

                editButton.forEach(button => {
                    button.addEventListener("click", function () {
                        const materialId = this.getAttribute("data-id");
                        const tr = this.closest("tr");
                        const originalValues = {};
    
                        const removeButton = tr.querySelector(".btn-remove");
                        const alterButton = tr.querySelector(".btn-edit");
                    
    
                        ["material", "quantity","unit"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            originalValues[name] = cell.textContent.trim();
                            cell.innerHTML = `<input type="text" name="${name}" value="${originalValues[name]}">`;
                        });

                        removeButton.remove()
                        alterButton.remove()
    
                        let saveButton = document.createElement("button");
                        saveButton.textContent = "Salvar";
                        saveButton.classList.add("btn-save");
                        tr.querySelector("td:last-child").appendChild(saveButton);
    
                        let cancelButton = document.createElement("button");
                        cancelButton.textContent = "Cancelar";
                        cancelButton.classList.add("btn-cancel");
                        tr.querySelector("td:last-child").appendChild(cancelButton);
    
                        cancelButton.addEventListener("click", function () {
                            cancelButton.remove();
                            saveButton.remove();
    
                            ["material", "quantity","unit"].forEach(name => {
                                let cell = tr.querySelector(`[name="${name}"]`);
                                cell.innerHTML = originalValues[name];
                            });
    
                            loadMaterialTable() 
                        });
    
                        saveButton.addEventListener("click", function () {
                            const material = tr.querySelector('input[name="material"]').value;
                            const quantity = tr.querySelector('input[name="quantity"]').value;
                            const unit = tr.querySelector('input[name="unit"]').value;
    
                            API.APIPut_MaterialList(materialId, material, quantity, unit)
                                .then(data => {
                                    alert(data.message);
                                    loadMaterialTable() 
                                });
                        });
                    });
                });
            });

            listContainer.appendChild(listContainer);
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
            <button class="addMaterial-btn">Adicionar</button>
            <button class="deleteMaterial-btn">Remover</button>
        </td>
    `;

    const addButton = newRow.querySelector(".addMaterial-btn");
    const deleteButton = newRow.querySelector(".deleteMaterial-btn");

    addButton.addEventListener("click", function() {
        const material = newRow.querySelector('input[name="material"]').value;
        const quantity = newRow.querySelector('input[name="quantity"]').value;
        const unit = newRow.querySelector('input[name="unit"]').value;

        API.APIPost_MaterialList(amigurumiId,material,quantity,unit)
        .then(data => {
            alert(data.message)
            loadMaterialTable()
        })
    });

    deleteButton.addEventListener("click", function() {
        removeRow(deleteButton);
    });
}






// ------------------ tabela de Dados Básicos -------------------------- \\
function loadInformatianAmigurumi(){
    API.APIGet_FoundationList()
        .then(data => {
            data
            .filter(row=> parseInt(row.amigurumi_id) == parseInt(amigurumiId))
            .forEach(foundation_list => {

                const amigumi_name = document.getElementById("amigurmi_name_recipe")
                amigumi_name.textContent = foundation_list.name

                const amigumi_size = document.getElementById("amigurmi_name_size")
                amigumi_size.textContent = "Tamanho (cm): " + foundation_list.size;

                const amigumi_autor = document.getElementById("amigurmi_name_autor")
                amigumi_autor.textContent = "Criador: " + foundation_list.autor;
            });
    })

}


function createEditBox() {
    if (document.getElementById("editAmigurumiBox")) {
        return;
    }

    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];

    API.APIGet_FoundationList()
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
                <label>Observação: <input type="text" id="editObs" value="${amigurumiData.obs}"></label><br><br>
                <button id="saveEdit">Salvar</button>
                <button id="cancelEdit">Cancelar</button>
            `;

            document.body.appendChild(modal);

            document.getElementById("saveEdit").addEventListener("click", function () {

                const amigurumi_id = amigurumiId
                const name = document.getElementById("editName").value
                const autor = document.getElementById("editAuthor").value
                const size = document.getElementById("editSize").value
                const link = document.getElementById("editLink").value
                const amigurumi_id_of_linked_amigurumi = amigurumiData.amigurumi_id_of_linked_amigurumi
                const obs = document.getElementById("editObs").value
 
                API.APIPut_FoundationList(amigurumi_id,name,autor,size,link,amigurumi_id_of_linked_amigurumi,obs)
                .then(data =>{
                    alert(data.message)
                    loadMaterialTable()
                    loadInformatianAmigurumi()
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



function deleteAmigurumi(){
    let confirmDelete = confirm("Tem certeza que deseja excluir este Amigurumi?");
    
    if (confirmDelete) {
        var urlParams = new URLSearchParams(window.location.search);
        var amigurumi_id = urlParams.get("id").split("?")[0]

        API.APIDelete_FoundationList(amigurumi_id)
        .then(data => {
            alert(data.message)
            window.location.href = "_amigurumi.html"
        })

    } else {
        alert("Ação cancelada.");
    } 
}



// ------------------ Card de Novas Receitas -------------------------- \\
function loadNewCardsBellow(){
    API.APIGet_FoundationList()
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

                    API.APIGet_Image()
                        .then(imageData => {
                            const imageSrcArray = imageData
                                .filter(row => row.amigurumi_id == amigurumi.amigurumi_id)
                                .map(row => row.image_route); 

                            let currentIndex = 0;

                            const imageElement = document.createElement('img');
                            imageElement.src = `http://localhost:8000/${imageSrcArray[currentIndex]}`;
                            imageElement.alt = amigurumi.name;
                            imageElement.id = "cardAmigurumiImage";

                            function showPreviousImage() {
                                currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                                imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`;
                            }
                            
                            function showNextImage() {
                                currentIndex = (currentIndex + 1) % imageSrcArray.length;
                                imageElement.src =  `http://localhost:8000/${imageSrcArray[currentIndex]}`;
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
}





// ------------------ Criando Novas Receitas -------------------------- \\

function addNewAmigurumi() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = urlParams.get("id").split("?")[0];


    let overlay = document.createElement("div");
    overlay.id = "modalOverlayAmigurumiRelationship";
    document.body.appendChild(overlay);

    let modal = document.createElement("div");
    modal.id = "addNewAmigurumiBoxiRelationship";
    modal.innerHTML = `
        <h3>Adicionar Novo Amigurumi</h3>
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
        const obsAmigurumi =  document.getElementById("editObs").value
        

        API.APIPost_FoundationList(nameAmigurumi,autorAmigurumi,sizeAmigurumi,linkAmigurumi,amigurumiId,obsAmigurumi)
        .then(data => {
            alert(data.message)
            loadNewCardsBellow()
        })
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById("cancelEdit").addEventListener("click", function () {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    })
}



document.addEventListener("DOMContentLoaded", () => {
    loadNewCardsBellow();
    loadInformatianAmigurumi();
    loadStitchbookTable();
    loadImagemTable();
    loadMaterialTable();
    loadStitchbookSequenceTable()
});



document.getElementById("add_new_amigurumi_relationship").addEventListener("click", addNewAmigurumi);
document.getElementById("amigurumi_image_edit").addEventListener("click", createImageEditBox);
document.getElementById("amigurumi_edit").addEventListener("click", createEditBox);
document.getElementById("delete_amigurumi").addEventListener("click", deleteAmigurumi);
document.getElementById('add_material').addEventListener('click', addRowMaterialTable)
document.getElementById('add_new_element_stitchbook').addEventListener('click', addNewElement)




// ------------------ Complementares -------------------------- \\
function removeRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
