const inputUsuarioCliente = document.getElementById("input-usuario")
const inputSenhaCliente = document.getElementById("input-senha")
const botaoLoginCliente = document.getElementById("botao-login")
const botaoIrAdmin = document.getElementById("ir-para-admin")

document.getElementById("ir-para-admin").addEventListener("click", () => {
    window.location.href = "../Admin/index.html"
})