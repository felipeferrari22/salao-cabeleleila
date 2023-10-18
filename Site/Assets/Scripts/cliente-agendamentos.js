/**
 * Script referente ao controlador da tela
 * de agendamentos do painel do Cliente
 * (Cliente/agendamentos.html)
 */


// Função que realiza o cancelamento de um agendamento
const deletarAgendamento = (id) => {
    // Busca o JWT nos cookies
    let JWT = ""
    try{
        JWT = document.cookie
                    .split("; ")
                    .find(tag => tag.startsWith("JWT="))
                    .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return; // Retorna caso não ache
    }

    fetch(`http://localhost:3000/DeletarAgendamento/${id}`, {
        method: "DELETE",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            location.reload()
            console.log(json.message)
            alert(json.message)
        }
    })
    .catch((err) => {
        console.error(err)
        alert("Ocorreu um erro")
    })
}

// Função que atribui eventListeners aos elementos dos agendamentos
const atribuirEventListeners = () => {
    const botoes = document.getElementsByClassName("botao-opcoes-agendamento")
    const spans = document.getElementsByClassName("botao-cancelar-agendamento")

    for(let i = 0; i<botoes.length; i++)
    {
        const botao = botoes[i]
        const span = botao.parentElement.children[1]

        // EventListener para abrir o elemento <span> Cancelar </span>
        botao.addEventListener("click", () => {
            if(span.classList.contains("aberto")){
                span.classList.remove("aberto")
            } else {
                for(let j=0; j<spans.length; j++)
                    spans[j].classList.remove("aberto")
                span.classList.add("aberto")    
            }
        })

        // EventListener para chamada da função de cancelamento do agendamento
        span.addEventListener("click", () => {
            deletarAgendamento(span.getAttribute("objectId"))
        })
    }
}

// Função que realiza o display dos agendamentos do cliente
const displayAgendamentos = (agendamentos) => {

    const container = document.getElementById("container-agendamentos")
    container.style.opacity = "0"

    let agendamentosHTML = ""
    agendamentos.forEach((agendamento, index) => {
        agendamentosHTML += `
        <li class="agendamento">
            <span class="agendamento-numero">
                ${index+1}&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
            <div class="agendamento-dados">
                <div class="agendamento-dados-superior">
                    <p>${agendamento.data}</p>
                    <p>R$${agendamento.preco},00</p>
                </div>
                <div class="agendamento-dados-inferior">
                    <p>${agendamento.servicos}</p>
                    <div>
                        <button type="button" class="botao-opcoes-agendamento">
                        </button>
                        <span type="button" class="botao-cancelar-agendamento" objectId="${agendamento._id.toString()}">Cancelar</span>
                    </div>
                </div>
            </div>
        </li>
        `
    })

    container.innerHTML = agendamentosHTML
    container.style.opacity = "1"

    // Invoca a função que atribui eventListeners aos botões
    atribuirEventListeners()
}

// Função que busca os agendamentos do Cliente
const buscarAgendamentos = () => {

    // Busca o JWT e EMAIL nos cookies
    let JWT = ""
    let EMAIL = ""
    try{
        EMAIL = document.cookie
                .split("; ")
                .find(tag => tag.startsWith("EMAIL="))
                .split("=")[1]
        JWT = document.cookie
                    .split("; ")
                    .find(tag => tag.startsWith("JWT="))
                    .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return; // Retorna caso não ache
    }

    fetch(`http://localhost:3000/BuscarMeusAgendamentos/`, {
        method: "GET",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            // Caso haja agendamentos, invoca seu display
            if(json.agendamentos.length > 0) {
                displayAgendamentos(json.agendamentos)
            } else {
                console.log("Não há agendamentos feitos")
            }           
        }
    })
    .catch((err) => {
        console.error(err)
        alert("Ocorreu um erro")
    })
}

// Onload da página
window.onload = buscarAgendamentos

// Onclick que resulta no fechamento do <span> Cancelar </span>
// caso o usuário clique no resto da tela
window.onclick = (e) => {
    if(
        !e.target.classList.contains("botao-cancelar-agendamento")  && 
            (
            !e.target.classList.contains("botao-opcoes-agendamento")&&
            !e.target.parentElement.classList.contains("botao-opcoes-agendamento")
            )
    ) {
        const spans = document.getElementsByClassName("botao-cancelar-agendamento")
        for(let j=0; j<spans.length; j++)
            spans[j].classList.remove("aberto")
    }
}