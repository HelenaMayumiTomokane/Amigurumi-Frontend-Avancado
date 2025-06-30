const baseURL = "http://127.0.0.1:5000"


/*------------------- API com a tabela Account User ---------------------------*/
export function APIGet_AccountUser(){
    return fetch(`${baseURL}/account_user`)
        .then(response => response.json())
        .then(data => data)
}



export function APIPost_AccountUser(name,password,login,role){
    return fetch(`${baseURL}/account_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "name": String(name),
            "login": String(login),
            "password": String(password),
            "role": String(role),
        })
    })
    .then(response => response.json())
    .then(data => data)

    
}



export function APIPut_AccountUser(user_id,name,password,login,role){
    return fetch(`${baseURL}/account_user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": parseInt(user_id),
            "name": String(name),
            "login": String(login),
            "password": String(password),
            "role": String(role),
        })
    })
    .then(response => response.json())
    .then(data => data)
}



export function APIDelete_AccountUser(user_id){
    return fetch(`${baseURL}/account_user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": parseInt(user_id),
        })
    })
    .then(response => response.json())
    .then(data => data)
}

