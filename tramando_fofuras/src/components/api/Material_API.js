const baseURL = "http://127.0.0.1:5000"

/*------------------- API com a tabela Material ---------------------------*/
export function APIGet_MaterialList(){
    return fetch(`${baseURL}/material_list`)
    .then(response => response.json())
    .then(data => data)
}



export function APIPost_MaterialList(amigurumi_id,material_name,quantity,list_id,colour_id){
    return fetch(`${baseURL}/material_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id),
            "material_name": String(material_name),
            "quantity": String(quantity),
            "list_id": parseInt(list_id),
            "colour_id": parseInt(colour_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_MaterialList(materialId, material_name, quantity,list_id,colour_id,amigurumi_id){
    return fetch(`${baseURL}/material_list/material_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_id":parseInt(materialId),
            "material_name": String(material_name),
            "quantity": String(quantity),
            "list_id": parseInt(list_id),
            "colour_id": parseInt(colour_id),
            "amigurumi_id": parseInt(amigurumi_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_MaterialList(materialId){
    return fetch(`${baseURL}/material_list/material_id`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "material_id": parseInt(materialId)
        })
    })
    .then(response => response.json())
    .then(data => data)
}


