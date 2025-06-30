const baseURL = "http://127.0.0.1:5000"

/*------------------- API com a tabela Stitchbook Sequence ---------------------------*/
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
