/**
 * Script utilizado no funcionamento do
 * cabeçalho no painel do Cliente
 */

// Verifica se há o JWT, se não envia o usuário para tela de login
try{
    const JWT = document.cookie
                .split("; ")
                .find(tag => tag.startsWith("JWT="))
                .split("=")[1]
    fetch("http://localhost:3000/authJWT", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then((res) => {
        if(res.status.toString()[0] === "4")
            window.location.href = "./index.html"
    })
    .catch((err) => {
        console.error(err)
        window.location.href = "./index.html"
    })
}catch{
    window.location.href = "./index.html"
}

// EventListener para realizar Logout
document.getElementById("botao-logout").addEventListener("click", () => {
    document.cookie = "JWT="                    // -> Apaga o JWT dos Cookies
    window.location.replace("./index.html")     // -> Retorna para a página de login
})