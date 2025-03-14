export function APIGet_Stitchbook(){
    return fetch(`http://127.0.0.1:5000/stitchbook`)
        .then(response => response.json())
        .then(data => data)
}

export function APIPut_Stitchbook(stitchbookIdPut, amigurumiId, observation, element,number_row,colour,stich_sequence){
    return fetch(`http://127.0.0.1:5000/stitchbook/line_id`, { 
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


export function APIPost_Stitchbook(amigurumi_id,element,number_row,colour,stich_sequence,observation){
    return fetch("http://127.0.0.1:5000/stitchbook", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "amigurumi_id": amigurumi_id ,
            "observation": observation,
            "element": element,
            "number_row": number_row,
            "colour": colour,
            "stich_sequence": stich_sequence
        })
    })
    .then(response => response.json())
    .then(data => data)
}

export function APIDelete_Image(imageId){
    return fetch(`http://127.0.0.1:5000/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "imageId": imageId
        })
    })
    .then(response => response.json())
}

export function APIGet_MaterialList(){
    return fetch(`http://127.0.0.1:5000/material_list`)
    .then(response => response.json())
    .then(data => data)
}


export function APIPut_MaterialList(materialId, updatedMaterial, updatedQuantity, updatedUnit){
    return fetch(`http://127.0.0.1:5000/material_list/material_list_id`, {
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


export function APIPost_Image(main_image,image_route,observation,amigurumi_id){
    return etch(`http://127.0.0.1:5000/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "main_image": main_image,
            "image_route": image_route,
            "observation": observation,
            "amigurumi_id": amigurumi_id,
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_MaterialList(amigurumiId,material,quantity,unit){
    return fetch("http://127.0.0.1:5000/material_list", {
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



export function APIGet_FoundationList(){
    return fetch(`http://127.0.0.1:5000/foundation_list`)
        .then(response => response.json())
        .then(data => data)
}



export function APIGet_Image(){
    return fetch(`http://127.0.0.1:5000/image`)
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



