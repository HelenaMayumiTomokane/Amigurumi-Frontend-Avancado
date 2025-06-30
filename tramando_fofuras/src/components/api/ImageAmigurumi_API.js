const baseURL = "http://127.0.0.1:5000"


/*------------------- API com a tabela Image ---------------------------*/
export function APIGet_Image(){
    return fetch(`${baseURL}/image`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_Image(main_image,amigurumi_id,list_id,image_base64){
    return fetch(`${baseURL}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "main_image": Boolean(main_image),
            "amigurumi_id": parseInt(amigurumi_id),
            "list_id":parseInt(list_id),
            "image_base64": String(image_base64)
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIPut_Image(image_id,main_image,amigurumi_id,list_id,image_base64){
    return fetch(`${baseURL}/image/image_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "image_id": parseInt(image_id),
            "main_image": Boolean(main_image),
            "amigurumi_id": parseInt(amigurumi_id),
            "list_id":parseInt(list_id),
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

