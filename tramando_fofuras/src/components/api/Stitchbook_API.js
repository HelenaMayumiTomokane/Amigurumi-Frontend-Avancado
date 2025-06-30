const baseURL = "http://127.0.0.1:5000"

/*------------------- API com a tabela Stitchbook ---------------------------*/
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

