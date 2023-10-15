// EventListener para realizar Logout
document.getElementById("botao-logout").addEventListener("click", () => {
    document.cookie = "JWT="                    // -> Apaga o JWT dos Cookies
    document.cookie = "APTO="                   // -> Apaga o APTO dos Cookies
    window.location.replace("./index.html")     // -> Retorna para a página de login
})