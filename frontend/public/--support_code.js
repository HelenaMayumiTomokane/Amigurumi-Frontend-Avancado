const baseURL = "http://127.0.0.1:5000"

/*------------------- Stitchbook ---------------------------*/
export function APIGet_Stitchbook(){
    return fetch(`${baseURL}/stitchbook`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_Stitchbook(amigurumi_id,element_id,number_row,colour_id,stich_sequence,observation){
    return fetch(`${baseURL}/stitchbook`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id) ,
            "observation": String(observation),
            "element_id": parseInt(element_id),
            "number_row": parseInt(number_row),
            "colour_id": parseInt(colour_id),
            "stich_sequence": String(stich_sequence),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_Stitchbook(stitchbookIdPut, amigurumi_id, observation, element_id,number_row,colour_id,stich_sequence){
    return fetch(`${baseURL}/stitchbook/line_id`, { 
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "line_id": parseInt(stitchbookIdPut),
                "amigurumi_id": parseInt(amigurumi_id),
                "observation": String(observation),
                "element_id": parseInt(element_id),
                "number_row": parseInt(number_row),
                "colour_id": parseInt(colour_id),
                "stich_sequence": String(stich_sequence),
            })
        })
        .then(response => response.json())
        .then(data => data)
}



export function APIDelete_Stitchbook(stitchbookIdDelete){
    return fetch(`${baseURL}/stitchbook/line_id`, { 
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "line_id": parseInt(stitchbookIdDelete),
            })
        })
        .then(response => response.json())
        .then(data => data)
}



/*------------------- Stitchbook Sequence ---------------------------*/
export function APIGet_Stitchbook_Sequence(){
    return fetch(`${baseURL}/stitchbook_sequence`)
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_Stitchbook_Sequence(amigurumi_id,element_name,element_order,repetition){
    return fetch(`${baseURL}/stitchbook_sequence`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id) ,
            "element_name": String(element_name),
            "element_order": parseInt(element_order),
            "repetition": parseInt(repetition),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_Stitchbook_Sequence(element_id,amigurumiId, element_name, element_order,repetition){
    return fetch(`${baseURL}/stitchbook_sequence/element_id`, { 
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "element_id": parseInt(element_id),
            "amigurumi_id":parseInt(amigurumiId),
            "element_order": parseInt(element_order),
            "element_name": String(element_name),
            "repetition": parseInt(repetition),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_Stitchbook_Sequence(element_id){
    return fetch(`${baseURL}/stitchbook_sequence/element_id`, { 
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "element_id": parseInt(element_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Image ---------------------------*/
export function APIPost_Image(main_image,amigurumi_id,recipe_id,image_base64){
    return fetch(`${baseURL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "main_image": Boolean(main_image),
            "amigurumi_id": parseInt(amigurumi_id),
            "recipe_id":parseInt(recipe_id),
            "image_base64": String(image_base64)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIGet_Image(){
    return fetch(`${baseURL}/image`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPut_Image(image_id,main_image,amigurumi_id,recipe_id,image_base64){
    return fetch(`${baseURL}/image/image_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "image_id": parseInt(image_id),
            "main_image": Boolean(main_image),
            "amigurumi_id": parseInt(amigurumi_id),
            "recipe_id":parseInt(recipe_id),
            "image_base64": String(image_base64)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_Image(imageId){
    return fetch(`${baseURL}/image/image_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "image_id": parseInt(imageId)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Material ---------------------------*/
export function APIGet_MaterialList(){
    return fetch(`${baseURL}/material_list`)
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_MaterialList(amigurumi_id,material_name,quantity,recipe_id,colour_id){
    return fetch(`${baseURL}/material_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id),
            "material_name": String(material_name),
            "quantity": String(quantity),
            "recipe_id": parseInt(recipe_id),
            "colour_id": parseInt(colour_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_MaterialList(materialId, material_name, quantity,recipe_id,colour_id,amigurumi_id){
    return fetch(`${baseURL}/material_list/material_list_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_list_id":parseInt(materialId),
            "material_name": String(material_name),
            "quantity": String(quantity),
            "recipe_id": parseInt(recipe_id),
            "colour_id": parseInt(colour_id),
            "amigurumi_id": parseInt(amigurumi_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_MaterialList(materialId){
    return fetch(`${baseURL}/material_list/material_list_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_list_id": parseInt(materialId)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Foundation ---------------------------*/
export function APIGet_FoundationList(){
    return fetch(`${baseURL}/foundation_list`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_FoundationList(nameAmigurumi,autorAmigurumi,sizeAmigurumi,linkAmigurumi,amigurumi_id_of_linked_amigurumiAmigurumi,obsAmigurumi){
    return fetch(`${baseURL}/foundation_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": String(nameAmigurumi),
            "autor": String(autorAmigurumi),
            "size": parseFloat(sizeAmigurumi),
            "link": String(linkAmigurumi),
            "amigurumi_id_of_linked_amigurumi": parseInt(amigurumi_id_of_linked_amigurumiAmigurumi),
            "obs": String(obsAmigurumi),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_FoundationList(amigurumi_id,name,autor,size,link,amigurumi_id_of_linked_amigurumi,obs,date){
    return fetch(`${baseURL}/foundation_list/amigurumi_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id),
            "name": String(name),
            "autor": String(autor),
            "size": parseFloat(size),
            "link": String(link),
            "amigurumi_id_of_linked_amigurumi": parseInt(amigurumi_id_of_linked_amigurumi),
            "obs": String(obs),
            "date": new Date(date)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_FoundationList(amigurumi_id){
    return fetch(`${baseURL}/foundation_list/amigurumi_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Codes ---------------------------*/
export function createAmigurumiImageCard(cardID, filteredData){
    const cardAmigurumi = document.getElementById(cardID);
    cardAmigurumi.innerHTML = "";

    const uniqueIds = new Set();

    filteredData.forEach(amigurumi => {
        if (!uniqueIds.has(amigurumi.amigurumi_id)) {
            uniqueIds.add(amigurumi.amigurumi_id);
            
            const card = document.createElement("div");
            card.className = "cardAmigurumi";

            APIGet_Image()
                .then(imageData => {
                    const imageSrcArray = imageData
                        .filter(row => parseInt(row.amigurumi_id) == parseInt(amigurumi.amigurumi_id))
                        .map(row => row.image_base64); 

                    let currentIndex = 0;

                    const imageElement = document.createElement('img');
                    imageElement.src = `data:image/jpeg;base64,${imageSrcArray[currentIndex]}`
                    imageElement.alt = amigurumi.name;
                    imageElement.id = "cardAmigurumiImage";

                    function showPreviousImage() {
                        currentIndex = (currentIndex - 1 + imageSrcArray.length) % imageSrcArray.length;
                        imageElement.src = `data:image/jpeg;base64,${imageSrcArray[currentIndex]}`;
                    }
                    
                    function showNextImage() {
                        currentIndex = (currentIndex + 1) % imageSrcArray.length;
                        imageElement.src = `data:image/jpeg;base64,${imageSrcArray[currentIndex]}`;
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
        }
    });
}
