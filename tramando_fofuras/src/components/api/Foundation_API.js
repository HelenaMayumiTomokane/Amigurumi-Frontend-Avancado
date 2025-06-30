const baseURL = "http://127.0.0.1:5000"


/*------------------- API com a tabela Foundation ---------------------------*/
export function APIGet_FoundationList(){
    return fetch(`${baseURL}/foundation_list`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_FoundationList(nameAmigurumi,autorAmigurumi,sizeAmigurumi,linkAmigurumi,relationship,category){
    return fetch(`${baseURL}/foundation_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": String(nameAmigurumi),
            "autor": String(autorAmigurumi),
            "size": parseFloat(sizeAmigurumi),
            "link": String(linkAmigurumi),
            "relationship": parseInt(relationship),
            "category": String(category),
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta da API:', data);  // <-- aqui
        return data;
    });

    
}



export function APIPut_FoundationList(amigurumi_id,name,autor,size,link,relationship,date,category){
    return fetch(`${baseURL}/foundation_list/amigurumi_id`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "amigurumi_id": parseInt(amigurumi_id),
            "name": String(name),
            "autor": String(autor),
            "size": parseFloat(size),
            "link": String(link),
            "relationship": parseInt(relationship),
            "date": new Date(date),
            "category": String(category),
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

