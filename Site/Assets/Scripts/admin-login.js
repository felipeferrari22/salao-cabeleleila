const inputUsuarioAdmin = document.getElementById("input-usuario")
const inputSenhaAdmin = document.getElementById("input-senha")
const botaoLoginAdmin = document.getElementById("botao-login")
const botaoIrCliente = document.getElementById("ir-para-cliente")

document.getElementById("ir-para-cliente").addEventListener("click", () => {
    window.location.href = "../Cliente/index.html"
})