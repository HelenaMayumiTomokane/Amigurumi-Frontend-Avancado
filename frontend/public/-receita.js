import * as API from './--support_code.js';

var urlParams = new URLSearchParams(window.location.search);
var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

// ------------------ Stitchbook Element -------------------------- \\

function loadStitchbookSequenceTable() {
    API.APIGet_Stitchbook_Sequence()
        .then(data => {
            const table = document.getElementById("table_stitchbook_sequence");
            let tbody = table.querySelector("tbody");

            tbody.innerHTML = ""

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

            const filteredData = data.filter(row => parseInt(row.amigurumi_id) === amigurumiId);

            tbody.innerHTML = `
                ${filteredData.map(row => `
                    <tr data-id="${row.element_id}">
                        <td name="element_order">${row.element_order || ""}</td>
                        <td name="element_name">${row.element_name || ""}</td>
                        <td name="repetition">${row.repetition || ""}</td>
                        <td name="action">
                            <button class="btn-edit" alteration_botton_id="${row.element_id}">Alterar</button>
                            <button class="btn-remove" delete_botton_id="${row.element_id}">Deletar</button>
                        </td>
                    </tr>
                `).join("")}
            `;

            table.querySelectorAll(".btn-remove").forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = parseInt(this.getAttribute("delete_botton_id"));
                    let confirmDelete = confirm("Tem certeza que deseja excluir este Elemento?");
    
                    if (confirmDelete) {
                        API.APIDelete_Stitchbook_Sequence(elementId)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookSequenceTable();
                                loadStitchbookTable();
                            });
                    }
                });
            });

            table.querySelectorAll(".btn-edit").forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = parseInt(this.getAttribute("alteration_botton_id"));
                    const tr = this.closest("tr");
                    const originalValues = {};

                    const removeButton = tr.querySelector(".btn-remove");
                    const alterButton = tr.querySelector(".btn-edit");
                    removeButton.style.display = "none";
                    alterButton.style.display = "none";

                    ["element_order", "element_name", "repetition"].forEach(name => {
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

                        ["element_order", "element_name","repetition"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            cell.innerHTML = originalValues[name];
                        });

                        removeButton.style.display = "inline-block";
                        alterButton.style.display = "inline-block";
                    });

                    saveButton.addEventListener("click", function () {
                        const element_name = tr.querySelector('input[name="element_name"]').value;
                        const element_order = parseInt(tr.querySelector('input[name="element_order"]').value);
                        const repetition = parseInt(tr.querySelector('input[name="repetition"]').value);

                        API.APIPut_Stitchbook_Sequence(elementId, amigurumiId, element_name, element_order, repetition)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookSequenceTable();
                                loadStitchbookTable();
                            });
                    });
                });
            });
        })
}




    
function addNewElementRow() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    const table = document.getElementById("table_stitchbook_sequence").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const lastOrder = table.querySelectorAll("tr td[name='element_order']");
    const newOrder = lastOrder.length > 0 ? Math.max(...Array.from(lastOrder).map(cell => parseInt(cell.textContent.trim()))) + 1 : 1;

    newRow.innerHTML = `
        <td><input type="number" name="element_order" value="${newOrder}" required min="0"></td>
        <td><input type="text" name="element_name" required></td>
        <td><input type="number" name="repetition" value=1 required min="0"></td>
        <td name="action">
            <button class="btn-edit">Adicionar</button>
            <button class="btn-remove">Remover</button>
        </td>
    `;

    const addButton = newRow.querySelector(".btn-edit");
    const deleteButton = newRow.querySelector(".btn-remove");

    addButton.addEventListener("click", function () {
        const element_name = newRow.querySelector('input[name="element_name"]').value;
        const element_order = parseInt(newRow.querySelector('input[name="element_order"]').value);
        const repetition = parseInt(newRow.querySelector('input[name="repetition"]').value);

        API.APIPost_Stitchbook_Sequence(amigurumiId, element_name, element_order,repetition)
            .then(data => {
                alert(data.message);
                loadStitchbookSequenceTable();
                loadStitchbookTable();
            });
    });

    deleteButton.addEventListener("click", function () {
        newRow.remove();
    });
}


// ------------------ tabela de Imagem -------------------------- \\
function loadImagemTable(){
    API.APIGet_Image()
        .then(imageData => {
            const container = document.getElementById("cardAmigurumiRecipeImage");
            container.innerHTML = "";

            const filteredImages = imageData.filter(row => parseInt(row.amigurumi_id) === amigurumiId);

            if (filteredImages.length === 0) return;

            const imageSrcArray = filteredImages.map(row => [row.image_base64, row.recipe_id]);

            let currentIndex = 0;

            const imageElement = document.createElement('img');
            imageElement.src =  `data:image/jpeg;base64,${imageSrcArray[currentIndex][0]}`;
            imageElement.id = "amigurumiRecipeImageDisplay";

            const textRecipe = document.createElement('h2');
            textRecipe.innerText = `Receita: ${imageSrcArray[currentIndex][1]}`;
  
            function showPreviousImage() {
                currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                imageElement.src =  `data:image/jpeg;base64,${imageSrcArray[currentIndex][0]}`;
                textRecipe.innerText = `Receita: ${imageSrcArray[currentIndex][1]}`;
            }
            
            function showNextImage() {
                currentIndex = (currentIndex + 1) % imageSrcArray.length;
                imageElement.src =  `data:image/jpeg;base64,${imageSrcArray[currentIndex][0]}`;
                textRecipe.innerText = `Receita: ${imageSrcArray[currentIndex][1]}`;
            }
            
            const nextButton = document.createElement('button_next_previous');
            nextButton.innerText = ">";
            nextButton.addEventListener('click', showNextImage); 

            const prevButton = document.createElement('button_next_previous');
            prevButton.innerText = "<";
            prevButton.addEventListener('click', showPreviousImage);


            container.appendChild(textRecipe);
            container.appendChild(imageElement);
            container.appendChild(prevButton);
            container.appendChild(nextButton);
        });

}


function createImageEditBox() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

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
                <label>Imagem Principal: <input type="checkbox" id="editImagePrincipal"></label><br><br>
                <label>ID da Receita: <input type="number" id="editImageRecipeID"></label><br><br>
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
                        .filter(row=> parseInt(row.amigurumi_id) === amigurumiId)
                        .map(image => `
                        <li>
                            <img src= data:image/jpeg;base64,${image.image_base64} alt="Imagem"  width="200" height="auto">
                            <br>
                            <br>
                            <span>Imagem Principal: <input type="checkbox" name="main_image" ${image.main_image ? "checked" : ""}></span>
                            <br>
                            <span>ID da Receita: <input type="number" name="recipe_id" value="${image.recipe_id}"></span>                           
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
                const recipe_id = document.getElementById("editImageRecipeID").value;
                const main_image = document.getElementById("editImagePrincipal").checked;
                const image_base64 = document.getElementById("editImageFile").files[0];
            
                const reader = new FileReader();
                
                reader.onloadend = function() {
                    const base64String = reader.result.split(',')[1];
                    console.log(base64String);

                    API.APIPost_Image(main_image, amigurumiId, recipe_id,  base64String)
                        .then(data => {
                            alert(data.message);
                            loadImagemTable();
                            document.body.removeChild(modal);
                            document.body.removeChild(overlay);
                        })
                };
        
                reader.readAsDataURL(image_base64);
            });
            

            document.getElementById("cancelImageEdit").addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            const deleteBtns = document.querySelectorAll('.deleteImageBtn');
            deleteBtns.forEach(btn => {
                btn.addEventListener("click", function() {
                    const imageId = btn.getAttribute("data-id");
                    let confirmDelete = confirm("Tem certeza que deseja excluir esta Imagem?");
    
                    if (confirmDelete) {

                        API.APIDelete_Image(imageId)
                        .then(data => {
                            alert(data.message)
                            loadImagemTable()
                            document.body.removeChild(modal);
                            document.body.removeChild(overlay);
                        })
                    }   
                });
            });

            const edit_button = document.querySelectorAll('.btn-edit');
            edit_button.forEach(btn => {
                btn.addEventListener("click", function() {
                    const listItem = btn.closest("li");

                    const imageId = btn.getAttribute("data-id");
                    const main_image = listItem.querySelector('input[name="main_image"]').checked;
                    const recipe_id = parseInt(listItem.querySelector('input[name="recipe_id"]').value);
                    
                    const imageSrc = listItem.querySelector("img").src;
                    const image_base64 = imageSrc.split(',')[1];

                    API.APIPut_Image(imageId,main_image,amigurumiId,recipe_id,image_base64)
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
let lastSelectedRecipeId = 1; 

function selectMaterialList() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    API.APIGet_MaterialList()
        .then(data => {
            let list = document.getElementById("material_list_recipe");
            let button = document.getElementById("select_material_recipe");

            let selectedValue = list.value;

            list.innerHTML = "";

            let defaultOption = document.createElement("option");
            defaultOption.textContent = "Escolha a Receita";
            defaultOption.value = "";
            list.appendChild(defaultOption);

            let uniqueRecipes = Array.from(new Set(data.filter(row => parseInt(row.amigurumi_id) === amigurumiId).map(row => row.recipe_id)))
                                     .map(id => data.find(row => row.recipe_id === id));

            uniqueRecipes.forEach(row => {
                let option = document.createElement("option");
                option.value = row.recipe_id;
                option.textContent = `Receita ${row.recipe_id}`;
                list.appendChild(option);
            });

            if (selectedValue) {
                list.value = selectedValue;
            }

            button.addEventListener("click", function (event) {
                event.preventDefault(); 
                
                let selectedRecipeId = list.value;

                if (selectedRecipeId) {
                    lastSelectedRecipeId = selectedRecipeId
                    loadMaterialTable(selectedRecipeId);
                }
            });
        });
}

function loadMaterialTable(selectedRecipeId = lastSelectedRecipeId) {
    API.APIGet_MaterialList()
        .then(data => {
            let table = document.getElementById("table_amigurumi_material");
            let tbody = table.querySelector("tbody");

            tbody.innerHTML = ""

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);
            let filteredData = data.filter(row => parseInt(row.amigurumi_id) === amigurumiId && parseInt(selectedRecipeId) == parseInt(row.recipe_id))

            tbody.innerHTML = `
                ${filteredData.map(row => `
                    <tr data-id="${row.material_list_id}">
                        <td name="recipe_id">${row.recipe_id || ""}</td>
                        <td name="colour_id">${row.colour_id || ""}</td>
                        <td name="material_name">${row.material_name || ""}</td>
                        <td name="quantity">${row.quantity || ""}</td>
                        <td name="action">
                            <button class="btn-edit" data-id="${row.material_list_id}">Alterar</button>
                            <button class="btn-remove" data-id="${row.material_list_id}">Deletar</button>
                        </td>
                    </tr>
                `).join("")}
            `;

            table.querySelectorAll(".btn-remove").forEach(button => { 
                button.addEventListener("click", function () {
                    let materialId = this.getAttribute("data-id");
                    let confirmDelete = confirm("Tem certeza que deseja excluir este Material?");

                    if (confirmDelete) {
                        API.APIDelete_MaterialList(materialId)
                        .then(data => {
                            alert(data.message);
                            loadMaterialTable()
                        });
                    }
                });
            })

            table.querySelectorAll(".btn-edit").forEach(button => {
                button.addEventListener("click", function () {
                    const materialId = this.getAttribute("data-id");
                    const tr = this.closest("tr");
                    const originalValues = {};

                    const removeButton = tr.querySelector(".btn-remove");
                    const alterButton = tr.querySelector(".btn-edit");
                

                    ["recipe_id","colour_id","material_name", "quantity"].forEach(name => {
                        let cell = tr.querySelector(`[name="${name}"]`);
                        originalValues[name] = cell.textContent.trim();
                        cell.innerHTML = `<input type="text" name="${name}" value="${originalValues[name]}">`;
                    });

                    removeButton.style.display = "none";
                    alterButton.style.display = "none";

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

                        ["recipe_id","colour_id","material_name", "quantity"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            cell.innerHTML = originalValues[name];
                        });

                        removeButton.style.display = "inline-block";
                        alterButton.style.display = "inline-block";
                    });

                    saveButton.addEventListener("click", function () {
                        const colour_id = tr.querySelector('input[name="colour_id"]').value;
                        const recipe_id = tr.querySelector('input[name="recipe_id"]').value;
                        const material_name = tr.querySelector('input[name="material_name"]').value;
                        const quantity = tr.querySelector('input[name="quantity"]').value;

                        API.APIPut_MaterialList(materialId, material_name, quantity,recipe_id,colour_id,amigurumiId)
                            .then(data => {
                                alert(data.message);
                                loadMaterialTable() 
                            });
                    });
                });
            });

            listContainer.appendChild(listContainer);
        });
}



function addRowMaterialTable() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    const table = document.getElementById("table_amigurumi_material").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="number" name="recipe_id" required min="0"></td>
        <td><input type="number" name="colour_id" required min="0"></td>
        <td><input type="text" name="material_name" required></td>
        <td><input type="text" name="quantity" required></td>
        <td name="action">
            <button class="addMaterial-btn">Adicionar</button>
            <button class="deleteMaterial-btn">Remover</button>
        </td>
    `;

    const addButton = newRow.querySelector(".addMaterial-btn");
    const deleteButton = newRow.querySelector(".deleteMaterial-btn");

    addButton.addEventListener("click", function() {
        const colour_id = newRow.querySelector('input[name="colour_id"]').value;
        const recipe_id = newRow.querySelector('input[name="recipe_id"]').value;
        const material_name = newRow.querySelector('input[name="material_name"]').value;
        const quantity = newRow.querySelector('input[name="quantity"]').value;

        API.APIPost_MaterialList(amigurumiId, material_name, quantity, recipe_id, colour_id)
        .then(data => {
            alert(data.message)
            loadMaterialTable()
        })
    });

    deleteButton.addEventListener("click", function() {
        const row = deleteButton.parentNode.parentNode;
        row.parentNode.removeChild(row);
    });
}




// ------------------ Construção dos Dados -------------------------- \\

function loadStitchbookTable() {
    API.APIGet_Stitchbook()
        .then(data => {
            const stitchbookList = document.getElementById("div_stitchbookList");
            stitchbookList.innerHTML = "";

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

            const filteredData = data.filter(row => parseInt(row.amigurumi_id) === amigurumiId);

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
                return elementOrderA - elementOrderB;
            });

            sortedElementIds.forEach(element_id => {
                const tableContainer = document.createElement("div");
                tableContainer.classList.add("table-container");

                const elementName = groupedData[element_id][0].element_name;
                const repetition = groupedData[element_id][0].repetition;

                const tableTitle = document.createElement("h1");
                tableTitle.classList.add("stitchbook-table-title");
                tableTitle.textContent = `${elementName} x${repetition}`;
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
                        ${groupedData[element_id].map(row => {        
                            
                            return  `
                            <tr data-id="${row.line_id}">
                                <td name="number_row">${row.number_row || ""}</td>
                                <td name="colour_id">${row.colour_id || ""} </td>
                                <td name="stich_sequence">${row.stich_sequence || ""}</td>
                                <td name="observation">${row.observation || ""}</td>
                                <td name="action">
                                    ${row.line_id ? `
                                        <button class="btn-edit" alteration_botton_id="${row.line_id}">Alterar</button>
                                        <button class="btn-remove" delete_botton_id="${row.line_id}">Deletar</button>
                                    ` : ""}
                                </td>
                            </tr>
                        `}).join("")}
                    </tbody>
                    <br>
                    <br>
                    <button class="add_stitchbook" id="add_stitchbook_line">Adicionar</button>
                `;

                stitchbookList.appendChild(tableContainer);

                const removeButton = table.querySelectorAll(".btn-remove");
                const addRowButton = table.querySelector(".add_stitchbook");
                const alterButton = table.querySelectorAll(".btn-edit");

                removeButton.forEach(row => {
                    row.addEventListener("click", function () {
                        const stitchbookIdDelete = this.getAttribute("delete_botton_id");
                        let confirmDelete = confirm("Tem certeza que deseja excluir esta carreira?");
    
                        if (confirmDelete) {
                            API.APIDelete_Stitchbook(stitchbookIdDelete)
                                .then(data => {
                                    alert(data.message);
                                    loadStitchbookTable();
                                });
                        }
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

                        ["number_row", "colour_id", "stich_sequence", "observation"].forEach(name => {
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

                            ["number_row", "colour_id", "stich_sequence", "observation"].forEach(name => {
                                let cell = tr.querySelector(`[name="${name}"]`);
                                cell.innerHTML = originalValues[name];
                            });

                            removeButton.style.display = "inline-block";
                            alterButton.style.display = "inline-block";
                        });

                        saveButton.addEventListener("click", function () {
                            const number_row = parseInt(tr.querySelector('input[name="number_row"]').value);
                            const colour_id = parseInt(tr.querySelector('input[name="colour_id"]').value);
                            const stich_sequence = tr.querySelector('input[name="stich_sequence"]').value;
                            const observation = tr.querySelector('input[name="observation"]').value;

                            API.APIPut_Stitchbook(stitchbookIdPut, amigurumiId, observation, element_id, number_row, colour_id, stich_sequence)
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
                    const number_row = lastRow ? parseInt(lastRow.querySelector('td[name="number_row"]')?.textContent)+1|| 0+1 : 1
                    const colour_id =  lastRow ? parseInt(lastRow.querySelector('td[name="colour_id"]')?.textContent) || 1: 1
                    const stich_sequence =  lastRow ? lastRow.querySelector('td[name="stich_sequence"]')?.textContent || "": ''


                    newRow.innerHTML = `
                        <td><input type="number" name="number_row" value="${number_row}" required min="0"></td>
                        <td><input type="number" name="colour_id" value="${colour_id}" required min="0"></td>
                        <td><input type="text" name="stich_sequence" value="${stich_sequence}" required></td>
                        <td><input type="text" name="observation" required></td>
                        <td name="action">
                            <button class="btn-edit">Adicionar</button>
                            <button class="btn-remove">Remover</button>
                        </td>
                    `;

                    const addButton = newRow.querySelector(".btn-edit");
                    const deleteButton = newRow.querySelector(".btn-remove");

                    addButton.addEventListener("click", function () {
                        const number_row = parseInt(newRow.querySelector('input[name="number_row"]').value);
                        const colour_id = parseInt(newRow.querySelector('input[name="colour_id"]').value);
                        const stich_sequence = newRow.querySelector('input[name="stich_sequence"]').value;
                        const observation = newRow.querySelector('input[name="observation"]').value;

                        API.APIPost_Stitchbook(amigurumiId, element_id, number_row, colour_id, stich_sequence, observation)
                            .then(data => {
                                alert(data.message);
                                loadStitchbookTable();
                            })
                    });

                    deleteButton.addEventListener("click", function () {
                        newRow.remove();
                    });
                });
            
            });
        });
}



// ------------------ tabela de Dados Básicos -------------------------- \\
function loadInformatianAmigurumi(){
    API.APIGet_FoundationList()
        .then(data => {
            data
            .filter(row=> parseInt(row.amigurumi_id) == amigurumiId)
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


function createEditBoxFoundation() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    API.APIGet_FoundationList()
        .then(data => {
            const amigurumiData = data.find(row => parseInt(row.amigurumi_id) === amigurumiId);

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
                <label>Tamanho: <input type="number" id="editSize" value="${amigurumiData.size}" required min="0"></label><br><br>
                <label>Link: <input type="url" id="editLink" value="${amigurumiData.link}"></label><br><br>
                <button id="saveEdit">Salvar</button>
                <button id="cancelEdit">Cancelar</button>
            `;

            document.body.appendChild(modal);

            document.getElementById("saveEdit").addEventListener("click", function () {

                const amigurumi_id = amigurumiId
                const name = document.getElementById("editName").value
                const autor = document.getElementById("editAuthor").value
                const size = parseFloat(document.getElementById("editSize").value)
                const link = document.getElementById("editLink").value
                const amigurumi_id_of_linked_amigurumi = parseInt(amigurumiData.amigurumi_id_of_linked_amigurumi)
                const date = new Date(amigurumiData.date)
 
                API.APIPut_FoundationList(amigurumi_id,name,autor,size,link,amigurumi_id_of_linked_amigurumi,date)
                .then(data =>{
                    alert(data.message)
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
        var amigurumi_id = parseInt(urlParams.get("id").split("?")[0])

        API.APIDelete_FoundationList(amigurumi_id)
        .then(data => {
            alert(data.message)
            window.location.href = "_amigurumi.html"
        })

    }
}



// ------------------ Card de Novas Receitas -------------------------- \\
function loadNewCardsBellow(){
    API.APIGet_FoundationList()
        .then(data => {
            var cardID = "cardAmigurumiRelationship"

            const filteredData = data.filter(row => parseInt(row.amigurumi_id_of_linked_amigurumi) === amigurumiId);

            if (filteredData.length === 0) {
                const cardAmigurumi = document.getElementById(cardID);
                cardAmigurumi.innerHTML = "";

                const noResultsMessage = document.createElement('p');
                noResultsMessage.textContent = "Parece que não encontramos nada relacionado a esse item. Não desanime! Tente explorar outras opções incríveis!";
                cardAmigurumi.appendChild(noResultsMessage);
            } else {
                API.createAmigurumiImageCard(cardID, filteredData)
            }
        })
}






// ------------------ Criando Novas Receitas -------------------------- \\

function addNewAmigurumi() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);


    let overlay = document.createElement("div");
    overlay.id = "modalOverlayAmigurumiRelationship";
    document.body.appendChild(overlay);

    let modal = document.createElement("div");
    modal.id = "addNewAmigurumiBoxiRelationship";
    modal.innerHTML = `
        <h3>Adicionar Novo Amigurumi</h3>
        <label>Nome: <input type="text" id="editName" required></label><br><br>
        <label>Autor: <input type="text" id="editAuthor" required></label><br><br>
        <label>Tamanho: <input type="number" id="editSize" required min="0"></label><br><br>
        <label>Link: <input type="url" id="editLink" required></label><br><br>
        <label>Observação: <input type="text" id="editObs"></label><br><br>
        <button id="saveEdit">Salvar</button>
        <button id="cancelEdit">Cancelar</button>
    `;

    document.body.appendChild(modal);

    document.getElementById("saveEdit").addEventListener("click", function () {

        const nameAmigurumi = document.getElementById("editName").value
        const autorAmigurumi =  document.getElementById("editAuthor").value
        const sizeAmigurumi = parseFloat(document.getElementById("editSize").value)
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
document.getElementById("amigurumi_edit").addEventListener("click", createEditBoxFoundation);
document.getElementById("delete_amigurumi").addEventListener("click", deleteAmigurumi);
document.getElementById('add_material').addEventListener('click', addRowMaterialTable)
document.getElementById("add_stitchbook_sequence").addEventListener("click", addNewElementRow)
document.getElementById("material_list_recipe").addEventListener("click", selectMaterialList)

