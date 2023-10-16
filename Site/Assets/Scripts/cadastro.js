const botaoIrLogin = document.getElementById("ir-para-login")
// Verifica o status do botão de criar de acordo com o valor do input
const botaoCriar = document.getElementById("botao-criar-conta")
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
botaoCriar.addEventListener("click", () => criarConta([inputCriarConta, nomeCriarConta, senhaCriarConta, confirmarCriarConta], inputCriarConta.value, nomeCriarConta.value, senhaCriarConta.value))

const criarConta = (inputs, email, nome, senha) => {
    fetch(`http://localhost:3000/Cadastro`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            email: email,
            nome: nome,
            senha: senha
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            inputs.forEach(input => input.value = "")
            console.log("Cliente cadastrado")
            alert("Cliente cadastrado com sucesso!")
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Ocorreu um erro")
    })
}

document.getElementById("ir-para-login").addEventListener("click", () => {
    window.location.href = "../Cliente/index.html"
})