/**
 * Script utilizado para realizar o login do admin
 */

// Verifica se já há JWT salvo em cookie
// Se sim, pula a etapa de login
// Senão, dá continuidade ao login
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
    .then(async(res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4")
            console.error(json.message)
        else
            window.location.href = "./menu.html"
    })
}catch{}

// Busca os elementos <input> e <button> do login
const inputUsuarioAdmin = document.getElementById("input-usuario")
const inputSenhaAdmin = document.getElementById("input-senha")
const botaoLoginAdmin = document.getElementById("botao-login")
const botaoIrCliente = document.getElementById("ir-para-cliente")

const validarInputs = () => {
    let validacao = 0
    inputUsuarioAdmin.value !== "" ? validacao++ : null
    inputSenhaAdmin.value !== "" ? validacao++ : null
    validacao === 2 ? botaoLoginAdmin.disabled = false : botaoLoginAdmin.disabled = true
}

// Define os listeners para o evento de "input" dos elementos <input>
inputUsuarioAdmin.oninput = validarInputs
inputSenhaAdmin.oninput = validarInputs

// EventListner no botão de envio
document.getElementById("botao-login").addEventListener("click", () => {
    // Dados de Login
    const email = inputUsuarioAdmin.value
    const senha = inputSenhaAdmin.value

    fetch(`http://localhost:3000/LoginAdmin`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            senha: senha
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"},
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log(json.message)
            document.cookie = `JWT=${json.accessToken}` // -> Salva JWT nos Cookies
            window.location.href = "./menu.html"
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Ocorreu um erro")
    })
})

document.getElementById("ir-para-cliente").addEventListener("click", () => {
    window.location.href = "../Cliente/index.html"
})