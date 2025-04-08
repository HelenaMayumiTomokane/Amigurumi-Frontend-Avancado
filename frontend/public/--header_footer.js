// Aba destinada para acionamento do cabeçalho e rodapé

document.addEventListener("DOMContentLoaded", function () {
    fetch("__header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header_container").innerHTML = data; 
        })
        
    fetch("__footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data; 
        })
});