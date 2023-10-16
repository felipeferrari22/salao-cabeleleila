const botaoIrLogin = document.getElementById("ir-para-login")
// Verifica o status do botão de criar de acordo com o valor do input
const botaoCriar = document.getElementById("botao-criar-modal-criar-conta")
const inputCriarConta = document.getElementById("input-criar-conta")
const nomeCriarConta = document.getElementById("input-nome-criar-conta")
const senhaCriarConta = document.getElementById("senha-criar-conta")
const confirmarCriarConta = document.getElementById("confirmar-senha-criar-conta")

// Função de validação dos inputs para tirar/colocar o disabled no botão de criar
const validarInputs = () => {
    let validacao = 0
    senhaCriarConta.value !== "" ? validacao++ : null                       //Senha !== ""
    confirmarCriarConta.value !== "" ? validacao++ : null                   //Confirmação !== ""
    senhaCriarConta.value === confirmarCriarConta.value ? validacao++ : null//Senha === Confirmação

    // Caso todos os testes sejam verdadeiros, retira o disable do botão
    validacao === 3 ? botaoCriar.disabled = false : botaoCriar.disabled = true
}

// Atribui a função de validar no evento "input" dos <input>s
senhaCriarConta.addEventListener("input", validarInputs)
confirmarCriarConta.addEventListener("input", validarInputs)

// EventListener para atribuir a função de criação de conta
botaoCriar.addEventListener("click", () => criarConta([inputCriarConta, senhaCriarConta, confirmarCriarConta], inputCriarConta.value, senhaCriarConta.value))

document.getElementById("ir-para-login").addEventListener("click", () => {
    window.location.href = "../Cliente/index.html"
})