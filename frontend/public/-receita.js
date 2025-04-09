//aba destinada para agrupamento das funções da aba receita

import * as API from './--support_code.js';

var urlParams = new URLSearchParams(window.location.search);
var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);
let lastSelectedRecipeId = 1; 
let lastFilterMaterialList = [];

// ------------------ Dados da Tabela Imagem -------------------------- \\
//carregar as imagens do amigurumi
function loadImagemTable(){ 
    API.APIGet_Image()
        .then(imageData => {
            const container = document.getElementById("cardAmigurumiRecipeImage");
            container.innerHTML = "";

            const filteredImages = imageData.filter(row => parseInt(row.amigurumi_id) === amigurumiId);

            if (filteredImages.length === 0) return;

            const imageSrcArray = filteredImages.map(row => [row.image_base64, row.list_id]);

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

//alteração, edição e imputação de novas imagens
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
                <label>Selecione um arquivo*: <input type="file" id="editImageFile" accept="image/*"></label><br><br>
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
                            <span>ID da Receita: <input type="number" name="list_id" value="${image.list_id}"></span>                           
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
            
            //adicionar novas imagens
            const addButton = document.getElementById("saveImageEdit")
            addButton.addEventListener("click", function () {
                const list_id = document.getElementById("editImageRecipeID").value;
                const main_image = document.getElementById("editImagePrincipal").checked;
                const image_base64 = document.getElementById("editImageFile").files[0];
            
                const reader = new FileReader();
                
                reader.onloadend = function() {
                    const base64String = reader.result.split(',')[1];
                    console.log(base64String);

                    API.APIPost_Image(main_image, amigurumiId, list_id,  base64String)
                        .then(data => {
                            if(data.message !== undefined){
                                alert(data.message)
                            }else{
                                const errorMessage = data.map(err => {
                                    const field = err.loc?.join('.') || 'campo desconhecido';
                                    return `Error in field "${field}": ${err.msg} (${err.type})`;
                                }).join('\n');
                
                                alert(errorMessage);
                            } 
                            loadImagemTable();
                            document.body.removeChild(modal);
                            document.body.removeChild(overlay);
                        })
                };
        
                reader.readAsDataURL(image_base64);
            });
            
            //cancelar operação
            const cancelButon = document.getElementById("cancelImageEdit")
            cancelButon.addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            //deletar a imagem
            const deleteButton= document.querySelectorAll('.deleteImageBtn');
            deleteButton.forEach(btn => {
                btn.addEventListener("click", function() {
                    const imageId = btn.getAttribute("data-id");
                    let confirmDelete = confirm("Tem certeza que deseja excluir esta Imagem?");
    
                    if (confirmDelete) {

                        API.APIDelete_Image(imageId)
                        .then(data => {
                            if(data.message !== undefined){
                                alert(data.message)
                            }else{
                                const errorMessage = data.map(err => {
                                    const field = err.loc?.join('.') || 'campo desconhecido';
                                    return `Error in field "${field}": ${err.msg} (${err.type})`;
                                }).join('\n');
                
                                alert(errorMessage);
                            } 
                            loadImagemTable()
                            document.body.removeChild(modal);
                            document.body.removeChild(overlay);
                        })
                    }   
                });
            });

            //editar a imagem
            const editButton = document.querySelectorAll('.btn-edit');
            editButton.forEach(btn => {
                btn.addEventListener("click", function() {
                    const listItem = btn.closest("li");

                    const imageId = btn.getAttribute("data-id");
                    const main_image = listItem.querySelector('input[name="main_image"]').checked;
                    const list_id = parseInt(listItem.querySelector('input[name="list_id"]').value);
                    
                    const imageSrc = listItem.querySelector("img").src;
                    const image_base64 = imageSrc.split(',')[1];

                    API.APIPut_Image(imageId,main_image,amigurumiId,list_id,image_base64)
                    .then(data => {
                        if(data.message !== undefined){
                            alert(data.message)
                        }else{
                            const errorMessage = data.map(err => {
                                const field = err.loc?.join('.') || 'campo desconhecido';
                                return `Error in field "${field}": ${err.msg} (${err.type})`;
                            }).join('\n');
            
                            alert(errorMessage);
                        } 
                        loadImagemTable()
                        document.body.removeChild(modal);
                        document.body.removeChild(overlay);
                    })                    
                });
            });
        })
}



// ------------------ Dados da Tabela Lista de Materiais -------------------------- \\
//selecionar materiais utilizados em cada receita
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
            defaultOption.textContent = "Escolha a Lista";
            defaultOption.value = "Escolha a Lista";
            list.appendChild(defaultOption);

            let uniqueRecipes = Array.from(new Set(data.filter(row => parseInt(row.amigurumi_id) === amigurumiId).map(row => row.list_id)))
                                     .map(id => data.find(row => row.list_id === id));

            uniqueRecipes.forEach(row => {
                let option = document.createElement("option");
                option.value = row.list_id;
                option.textContent = `Lista ${row.list_id}`;
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


//Carregar os materiais selecionados na função selectMaterialList, permitindo deletar ou editar o material 
function loadMaterialTable(selectedRecipeId = lastSelectedRecipeId) {
    API.APIGet_MaterialList()
        .then(data => {
            let table = document.getElementById("table_amigurumi_material");
            let tbody = table.querySelector("tbody");

            tbody.innerHTML = ""

            var urlParams = new URLSearchParams(window.location.search);
            var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);
            let filteredData = data.filter(row => parseInt(row.amigurumi_id) === amigurumiId && parseInt(selectedRecipeId) == parseInt(row.list_id))

            lastFilterMaterialList = filteredData;
            loadStitchbookTable(lastFilterMaterialList)

            tbody.innerHTML = `
                ${filteredData.map(row => `
                    <tr data-id="${row.material_id}">
                        <td name="list_id">${row.list_id || ""}</td>
                        <td name="colour_id">${row.colour_id || ""}</td>
                        <td name="material_name">${row.material_name || ""}</td>
                        <td name="quantity">${row.quantity || ""}</td>
                        <td name="action">
                            <button class="btn-edit" data-id="${row.material_id}">Alterar</button>
                            <button class="btn-remove" data-id="${row.material_id}">Deletar</button>
                        </td>
                    </tr>
                `).join("")}
            `;
            
            //deletar materiais
            const deleteButton = table.querySelectorAll(".btn-remove")
            deleteButton.forEach(button => { 
                button.addEventListener("click", function () {
                    let materialId = this.getAttribute("data-id");
                    let confirmDelete = confirm("Tem certeza que deseja excluir este Material?");

                    if (confirmDelete) {
                        API.APIDelete_MaterialList(materialId)
                        .then(data => {
                            if(data.message !== undefined){
                                alert(data.message)
                            }else{
                                const errorMessage = data.map(err => {
                                    const field = err.loc?.join('.') || 'campo desconhecido';
                                    return `Error in field "${field}": ${err.msg} (${err.type})`;
                                }).join('\n');
                
                                alert(errorMessage);
                            } 
                            loadMaterialTable()
                        });
                    }
                });
            })

            //editar materiais
            const editButton = table.querySelectorAll(".btn-edit")
            editButton.forEach(button => {
                button.addEventListener("click", function () {
                    const materialId = this.getAttribute("data-id");
                    const tr = this.closest("tr");
                    const originalValues = {};

                    const removeButton = tr.querySelector(".btn-remove");
                    const alterButton = tr.querySelector(".btn-edit");
                

                    ["list_id","colour_id","material_name", "quantity"].forEach(name => {
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

                    //cancelar operação
                    cancelButton.addEventListener("click", function () {
                        cancelButton.remove();
                        saveButton.remove();

                        ["list_id","colour_id","material_name", "quantity"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            cell.innerHTML = originalValues[name];
                        });

                        removeButton.style.display = "inline-block";
                        alterButton.style.display = "inline-block";
                    });

                    //salvar alteração
                    saveButton.addEventListener("click", function () {
                        const colour_id = tr.querySelector('input[name="colour_id"]').value;
                        const list_id = tr.querySelector('input[name="list_id"]').value;
                        const material_name = tr.querySelector('input[name="material_name"]').value;
                        const quantity = tr.querySelector('input[name="quantity"]').value;

                        API.APIPut_MaterialList(materialId, material_name, quantity,list_id,colour_id,amigurumiId)
                            .then(data => {
                                if(data.message !== undefined){
                                    alert(data.message)
                                }else{
                                    const errorMessage = data.map(err => {
                                        const field = err.loc?.join('.') || 'campo desconhecido';
                                        return `Error in field "${field}": ${err.msg} (${err.type})`;
                                    }).join('\n');
                    
                                    alert(errorMessage);
                                } 
                                loadMaterialTable() 
                            });
                    });
                });
            });

            listContainer.appendChild(listContainer);
        });
}


//adicionar novos materiais
function addRowMaterialTable() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    const table = document.getElementById("table_amigurumi_material").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="number" name="list_id" required min="0"></td>
        <td><input type="number" name="colour_id" required min="0"></td>
        <td><input type="text" name="material_name" required></td>
        <td><input type="text" name="quantity" required></td>
        <td name="action">
            <button class="addMaterial-btn">Adicionar</button>
            <button class="cancelaMaterial-btn">Remover</button>
        </td>
    `;

    //adicionar um novo material
    const addButton = newRow.querySelector(".addMaterial-btn");
    addButton.addEventListener("click", function() {
        const colour_id = newRow.querySelector('input[name="colour_id"]').value;
        const list_id = newRow.querySelector('input[name="list_id"]').value;
        const material_name = newRow.querySelector('input[name="material_name"]').value;
        const quantity = newRow.querySelector('input[name="quantity"]').value;

        API.APIPost_MaterialList(amigurumiId, material_name, quantity, list_id, colour_id)
        .then(data => {
            if(data.message !== undefined){
                alert(data.message)
            }else{
                const errorMessage = data.map(err => {
                    const field = err.loc?.join('.') || 'campo desconhecido';
                    return `Error in field "${field}": ${err.msg} (${err.type})`;
                }).join('\n');

                alert(errorMessage);
            } 
            loadMaterialTable()
        })
    });

    //cancelar operação
    const cancelButton = newRow.querySelector(".cancelaMaterial-btn");
    cancelButton.addEventListener("click", function() {
        const row = cancelButton.parentNode.parentNode;
        row.parentNode.removeChild(row);
    });
}




// ------------------ Dados da Tabela Stitchbook -------------------------- \\
//editar e deletar as carreiras dos pontos do amigurumi, sofrendo alteração da função loadMaterialTable, apenas na coluna Cor (para trazer o nome da linha de amigurumi)
function loadStitchbookTable(filterMaterialList = lastFilterMaterialList) {
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
                            <th>Carreira*</th>
                            <th>Cor*</th>
                            <th>Sequência de Ponto*</th>
                            <th>Observação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupedData[element_id].map(row => {        
                            const matchColourID = filterMaterialList.filter(rows => parseInt(rows.colour_id) === parseInt(row.colour_id))[0] || ""
                            const nameColour =  matchColourID.material_name? `: ${matchColourID.material_name.replace("Linha: ","") ||""}` :""
                            return  `
                            <tr data-id="${row.line_id||""}">
                                <td name="number_row">${row.number_row||""}</td>
                                <td name="colour_id">${row.colour_id||""}${nameColour||""}</td>
                                <td name="stich_sequence">${row.stich_sequence||""}</td>
                                <td name="observation">${row.observation||""}</td>
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
                
                //remover a carreira
                const removeButton = table.querySelectorAll(".btn-remove");
                removeButton.forEach(row => {
                    row.addEventListener("click", function () {
                        const stitchbookIdDelete = this.getAttribute("delete_botton_id");
                        let confirmDelete = confirm("Tem certeza que deseja excluir esta carreira?");
    
                        if (confirmDelete) {
                            API.APIDelete_Stitchbook(stitchbookIdDelete)
                                .then(data => {
                                    if(data.message !== undefined){
                                        alert(data.message)
                                    }else{
                                        const errorMessage = data.map(err => {
                                            const field = err.loc?.join('.') || 'campo desconhecido';
                                            return `Error in field "${field}": ${err.msg} (${err.type})`;
                                        }).join('\n');
                        
                                        alert(errorMessage);
                                    } 
                                    loadStitchbookTable();
                                });
                        }
                    });
                });

                //alterar a carreira
                const alterButton = table.querySelectorAll(".btn-edit");
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
                            cell.innerHTML = `<input type="text" name="${name}" value="${name =="colour_id"? parseInt(originalValues[name]) :originalValues[name]}">`;
                        });

                        let saveButton = document.createElement("button");
                        saveButton.textContent = "Salvar";
                        saveButton.classList.add("btn-save");
                        tr.querySelector("td:last-child").appendChild(saveButton);


                        let cancelButton = document.createElement("button");
                        cancelButton.textContent = "Cancelar";
                        cancelButton.classList.add("btn-cancel");
                        tr.querySelector("td:last-child").appendChild(cancelButton);

                        //cancelar a operação
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

                        //salvar alteração da carreira
                        saveButton.addEventListener("click", function () {
                            const number_row = parseInt(tr.querySelector('input[name="number_row"]').value);
                            const colour_id = parseInt(tr.querySelector('input[name="colour_id"]').value);
                            const stich_sequence = tr.querySelector('input[name="stich_sequence"]').value;
                            const observation = tr.querySelector('input[name="observation"]').value;

                            API.APIPut_Stitchbook(stitchbookIdPut, amigurumiId, observation, element_id, number_row, colour_id, stich_sequence)
                                .then(data => {
                                    if(data.message !== undefined){
                                        alert(data.message)
                                    }else{
                                        const errorMessage = data.map(err => {
                                            const field = err.loc?.join('.') || 'campo desconhecido';
                                            return `Error in field "${field}": ${err.msg} (${err.type})`;
                                        }).join('\n');
                        
                                        alert(errorMessage);
                                    } 
                                    loadStitchbookTable();
                                })
                        });
                    });
                });

                //adicionar uma nova carreira
                const addRowButton = table.querySelector(".add_stitchbook");
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
                                if(data.message !== undefined){
                                    alert(data.message)
                                }else{
                                    const errorMessage = data.map(err => {
                                        const field = err.loc?.join('.') || 'campo desconhecido';
                                        return `Error in field "${field}": ${err.msg} (${err.type})`;
                                    }).join('\n');
                    
                                    alert(errorMessage);
                                } 
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



// ------------------ Dados da Tabela Stitchbook Element -------------------------- \\
//construção da tabela de partes do amigurumi, para deletar e editar
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
            
            const deleteButton = table.querySelectorAll(".btn-remove")
            deleteButton.forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = parseInt(this.getAttribute("delete_botton_id"));
                    let confirmDelete = confirm("Tem certeza que deseja excluir este Elemento?");
    
                    if (confirmDelete) {
                        API.APIDelete_Stitchbook_Sequence(elementId)
                            .then(data => {
                                if(data.message !== undefined){
                                    alert(data.message)
                                }else{
                                    const errorMessage = data.map(err => {
                                        const field = err.loc?.join('.') || 'campo desconhecido';
                                        return `Error in field "${field}": ${err.msg} (${err.type})`;
                                    }).join('\n');
                    
                                    alert(errorMessage);
                                } 
                                loadStitchbookSequenceTable();
                                loadStitchbookTable();
                            });
                    }
                });
            });

            //editar elementos
            const editButton = table.querySelectorAll(".btn-edit")
            editButton.forEach(button => {
                button.addEventListener("click", function () {
                    const elementId = parseInt(this.getAttribute("alteration_botton_id"));
                    const tr = this.closest("tr");
                    const originalValues = {};

                    const removeButton = tr.querySelector(".btn-remove");
                    const editButton = tr.querySelector(".btn-edit");
                    removeButton.style.display = "none";
                    editButton.style.display = "none";

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

                    //Cancelar operação
                    cancelButton.addEventListener("click", function () {
                        cancelButton.remove();
                        saveButton.remove();

                        ["element_order", "element_name","repetition"].forEach(name => {
                            let cell = tr.querySelector(`[name="${name}"]`);
                            cell.innerHTML = originalValues[name];
                        });

                        removeButton.style.display = "inline-block";
                        editButton.style.display = "inline-block";
                    });

                    //salvar edição
                    saveButton.addEventListener("click", function () {
                        const element_name = tr.querySelector('input[name="element_name"]').value;
                        const element_order = parseInt(tr.querySelector('input[name="element_order"]').value);
                        const repetition = parseInt(tr.querySelector('input[name="repetition"]').value);

                        API.APIPut_Stitchbook_Sequence(elementId, amigurumiId, element_name, element_order, repetition)
                            .then(data => {
                                if(data.message !== undefined){
                                    alert(data.message)
                                }else{
                                    const errorMessage = data.map(err => {
                                        const field = err.loc?.join('.') || 'campo desconhecido';
                                        return `Error in field "${field}": ${err.msg} (${err.type})`;
                                    }).join('\n');
                    
                                    alert(errorMessage);
                                } 
                                loadStitchbookSequenceTable();
                                loadStitchbookTable();
                            });
                    });
                });
            });
        })
}


//adicionar uma nova parte do amigurumi
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
                if(data.message !== undefined){
                    alert(data.message)
                }else{
                    const errorMessage = data.map(err => {
                        const field = err.loc?.join('.') || 'campo desconhecido';
                        return `Error in field "${field}": ${err.msg} (${err.type})`;
                    }).join('\n');
    
                    alert(errorMessage);
                } 
                loadStitchbookSequenceTable();
                loadStitchbookTable();
            });
    });

    deleteButton.addEventListener("click", function () {
        newRow.remove();
    });
}



// ------------------ Dados da Tabela Foundation -------------------------- \\
//carregar informações sobre o amigurumi
function loadFoundationInformation(){
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

                if(foundation_list.link !=="" && foundation_list.link !==null){
                    const amigumi_link = document.getElementById("amigurmi_name_link")
                    amigumi_link.innerHTML = `Para acessar a receita original: <a href="${foundation_list.link}" target="_blank"> Clique Aqui </a>`;
                }
                
            });
    })

}


//editar informações sobre o amigurumi
function createEditBoxFoundation() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiId = parseInt(urlParams.get("id").split("?")[0]);

    API.APIGet_FoundationList()
        .then(data => {
            const amigurumiData = data.find(row => parseInt(row.amigurumi_id) === amigurumiId);

            let overlay = document.createElement("div");
            overlay.id = "modalOverlayAmigurumi";
            document.body.appendChild(overlay);

            let modal = document.createElement("div");
            modal.id = "editAmigurumiBox";

            modal.innerHTML = `
                <h3>Editar Amigurumi</h3>
                <label>Nome*: <input type="text" id="editName" value="${amigurumiData.name}"></label><br><br>
                <label>Autor*: <input type="text" id="editAuthor" value="${amigurumiData.autor}"></label><br><br>
                <label>Tamanho*: <input type="number" id="editSize" value="${amigurumiData.size}" required min="0"></label><br><br>
                <label>Link: <input type="url" id="editLink" value="${amigurumiData.link}"></label><br><br>
                <button id="saveEdit">Salvar</button>
                <button id="cancelEdit">Cancelar</button>
            `;

            document.body.appendChild(modal);

            //editar informações
            const editButton = document.getElementById("saveEdit")
            editButton.addEventListener("click", function () {

                const amigurumi_id = amigurumiId
                const name = document.getElementById("editName").value
                const autor = document.getElementById("editAuthor").value
                const size = parseFloat(document.getElementById("editSize").value)
                const link = document.getElementById("editLink").value
                const relationship = parseInt(amigurumiData.relationship)
                const date = new Date(amigurumiData.date)
 
                API.APIPut_FoundationList(amigurumi_id,name,autor,size,link,relationship,date)
                .then(data =>{
                    if(data.message !== undefined){
                        alert(data.message)
                    }else{
                        const errorMessage = data.map(err => {
                            const field = err.loc?.join('.') || 'campo desconhecido';
                            return `Error in field "${field}": ${err.msg} (${err.type})`;
                        }).join('\n');
        
                        alert(errorMessage);
                    }  
                    loadFoundationInformation()
                })

                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });

            //cancelar operação
            const cancelButton =  document.getElementById("cancelEdit")
            cancelButton.addEventListener("click", function () {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            });
        })
}


//Deletar tudo do amigurumi cadastrado no banco de dados
function deleteAmigurumiFoundation(){
    let confirmDelete = confirm("Tem certeza que deseja excluir este Amigurumi?");
    
    if (confirmDelete) {
        var urlParams = new URLSearchParams(window.location.search);
        var amigurumi_id = parseInt(urlParams.get("id").split("?")[0])

        API.APIDelete_FoundationList(amigurumi_id)
        .then(data => {
            if(data.message !== undefined){
                alert(data.message)
                window.location.href = "_amigurumi.html"
            }else{
                const errorMessage = data.map(err => {
                    const field = err.loc?.join('.') || 'campo desconhecido';
                    return `Error in field "${field}": ${err.msg} (${err.type})`;
                }).join('\n');

                alert(errorMessage);
            }  
            
        })

    }
}


// ------------------ Criação dos Cards das Receitas Relacionadas a Receita Principal -------------------------- \\
//adicição de um novo amigurumi relacionado ao amigurumi principal
function addNewAmigurumiFoundationRelationship() {
    var urlParams = new URLSearchParams(window.location.search);
    var amigurumiID = parseInt(urlParams.get("id").split("?")[0]);

    API.addNewAmigurumiFoundation(amigurumiID)
}


//Requsição para acionamento do código de criação de card dos amigurumis relacionados ao amigurumi principal
function loadCardsRelationshipAmigurumi(){
    API.APIGet_FoundationList()
        .then(data => {
            var cardID = "cardAmigurumiRelationship"

            const filteredData = data.filter(row => parseInt(row.relationship) === amigurumiId);

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


//acionamento instantâneo de todas as tabelas e dados
document.addEventListener("DOMContentLoaded", () => {
    loadCardsRelationshipAmigurumi();
    loadFoundationInformation();
    loadStitchbookTable();
    loadImagemTable();
    loadMaterialTable();
    loadStitchbookSequenceTable()
});


//acionamento por ação
document.getElementById("add_new_amigurumi_relationship").addEventListener("click", addNewAmigurumiFoundationRelationship);
document.getElementById("amigurumi_image_edit").addEventListener("click", createImageEditBox);
document.getElementById("amigurumi_edit").addEventListener("click", createEditBoxFoundation);
document.getElementById("delete_amigurumi").addEventListener("click", deleteAmigurumiFoundation);
document.getElementById('add_material').addEventListener('click', addRowMaterialTable)
document.getElementById("add_stitchbook_sequence").addEventListener("click", addNewElementRow)
document.getElementById("material_list_recipe").addEventListener("click", selectMaterialList)

