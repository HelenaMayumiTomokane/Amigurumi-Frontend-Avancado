/*------------------- Stitchbook ---------------------------*/
export function APIGet_Stitchbook(){
    return fetch(`http://127.0.0.1:5000/stitchbook`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_Stitchbook(amigurumi_id,element_id,number_row,colour_id,stich_sequence,observation){
    return fetch("http://127.0.0.1:5000/stitchbook", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id ,
            "observation": observation,
            "element_id": element_id,
            "number_row": number_row,
            "colour_id": colour_id,
            "stich_sequence": stich_sequence
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_Stitchbook(stitchbookIdPut, amigurumiId, observation, element_id,number_row,colour_id,stich_sequence){
    return fetch(`http://127.0.0.1:5000/stitchbook/line_id`, { 
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "line_id": stitchbookIdPut,
                "amigurumi_id": amigurumiId,
                "observation": observation,
                "element_id": element_id,
                "number_row": number_row,
                "colour_id": colour_id,
                "stich_sequence": stich_sequence
            })
        })
        .then(response => response.json())
        .then(data => data)
}



export function APIDelete_Stitchbook(stitchbookIdDelete){
    return fetch(`http://127.0.0.1:5000/stitchbook/line_id`, { 
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "line_id": stitchbookIdDelete,
            })
        })
        .then(response => response.json())
        .then(data => data)
}



/*------------------- Stitchbook Sequence ---------------------------*/
export function APIGet_Stitchbook_Sequence(){
    return fetch("http://127.0.0.1:5000/stitchbook_sequence")
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_Stitchbook_Sequence(amigurumi_id,element_name,element_order,repetition){
    return fetch("http://127.0.0.1:5000/stitchbook_sequence", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id ,
            "element_name": element_name,
            "element_order": element_order,
            "repetition": repetition,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_Stitchbook_Sequence(element_id,amigurumiId, element_name, element_order,repetition){
    return fetch(`http://127.0.0.1:5000/stitchbook_sequence/element_id`, { 
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "element_id": element_id,
            "amigurumi_id":amigurumiId,
            "element_order": element_order,
            "element_name": element_name,
            "repetition": repetition,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_Stitchbook_Sequence(element_id){
    return fetch(`http://127.0.0.1:5000/stitchbook_sequence/element_id`, { 
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "element_id": element_id,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Image ---------------------------*/
export function APIPost_Image(formData){
    return fetch(`http://127.0.0.1:5000/image`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIGet_Image(){
    return fetch(`http://127.0.0.1:5000/image`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPut_Image(image_id,observation,main_image,amigurumi_id){
    return fetch(`http://127.0.0.1:5000/image/image_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "image_id": image_id,
            "observation": observation,
            "main_image": main_image,
            "amigurumi_id": amigurumi_id,
            
        })
    })
    .then(response => response.json())
}



export function APIDelete_Image(imageId){
    return fetch(`http://127.0.0.1:5000/image/image_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "image_id": imageId
        })
    })
    .then(response => response.json())
}



/*------------------- Material ---------------------------*/
export function APIGet_MaterialList(){
    return fetch(`http://127.0.0.1:5000/material_list`)
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_MaterialList(amigurumi_id,material,quantity){
    return fetch("http://127.0.0.1:5000/material_list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id,
            "material": material,
            "quantity": quantity,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_MaterialList(material_list_id, material, quantity){
    return fetch(`http://127.0.0.1:5000/material_list/material_list_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_list_id":material_list_id,
            "material": material,
            "quantity": quantity,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_MaterialList(materialId){
    return fetch(`http://127.0.0.1:5000/material_list/material_list_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_list_id":materialId
        })
    })
    .then(response => response.json())
    .then(data => data)
}



/*------------------- Foundation ---------------------------*/
export function APIGet_FoundationList(){
    return fetch(`http://127.0.0.1:5000/foundation_list`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_FoundationList(nameAmigurumi,autorAmigurumi,sizeAmigurumi,linkAmigurumi,amigurumi_id_of_linked_amigurumiAmigurumi,obsAmigurumi){
    return fetch(`http://127.0.0.1:5000/foundation_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": nameAmigurumi,
            "autor": autorAmigurumi,
            "size": sizeAmigurumi,
            "link": linkAmigurumi,
            "amigurumi_id_of_linked_amigurumi": amigurumi_id_of_linked_amigurumiAmigurumi,
            "obs": obsAmigurumi
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_FoundationList(amigurumi_id,name,autor,size,link,amigurumi_id_of_linked_amigurumi,obs){
    return fetch(`http://127.0.0.1:5000/foundation_list/amigurumi_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id,
            "name": name,
            "autor": autor,
            "size": size,
            "link": link,
            "amigurumi_id_of_linked_amigurumi": amigurumi_id_of_linked_amigurumi,
            "obs": obs
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_FoundationList(amigurumi_id){
    return fetch(`http://127.0.0.1:5000/foundation_list/amigurumi_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id,
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
