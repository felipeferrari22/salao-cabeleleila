/**
 * Script utilizado no funcionamento do
 * calendáro (Cliente)
 */

// Instancia um novo calendário em <div id="calendar"></div>
const calendar = new VanillaCalendar("#calendar", {
    settings: {
        lang: 'pt-br',
        selection: {
            day: 'single',
            time: false,
        },
        visibility: {
            today: true,
        }
    },
    actions: {
        clickDay(e) {

            setTimeout(apagarDias, 750)
            // Formata data de YYYY-MM-DD -> DD/MM/YYYY
            const data = e.target.getAttribute("data-calendar-day")
            const dia = data.split("-")[2]
            const mes = data.split("-")[1]
            const ano = data.split("-")[0] 
            const dataFormatada = `${dia}/${mes}/${ano}`


            abrirModalConfirmacao(dataFormatada)
        },

        clickMonth() {
            setTimeout(apagarDias, 750)
        },

        clickYear() {
            setTimeout(apagarDias, 750)
        },
    }
}).init()

// Função que apaga dias que estão no passado
const apagarDias = () => {
    // Para todo dia, verifíca se há agendamentos e modifica sua classe de acordo
    const dias = document.getElementsByClassName("vanilla-calendar-day__btn")
    for(let i = 0; i < dias.length; i++)
    {
        const dia = dias[i]

        // Ler a Data
        const hoje = dia.getAttribute("data-calendar-day")  // Formato YYYY-MM-DD

        // Formatar a Data
        const anoHoje = hoje.split("-")[0]
        const mesHoje = hoje.split("-")[1]
        const diaHoje = hoje.split("-")[2]

        // Criar um objeto Date
        const dataHoje = new Date(parseInt(anoHoje), parseInt(mesHoje) - 1, parseInt(diaHoje))
        // Comparar a Data
        if(dataHoje.getTime() < new Date().getTime()) {
            // Atribuir Classe
            dia.disabled = true
            dia.classList.add("passado")
        } else {
            // Remover Classe
            dia.disabled = false
            dia.classList.remove("passado")
        }
    }
}


//** Script utilizado no Modal de Confirmação */
// Abrir Modal de Confirmação
const abrirModalConfirmacao = (data) => {
    const modal = document.getElementsByClassName("container-modal-confirmacao")[0]
    modal.classList.add("aberto")

    // Adiciona os EventListeners para fechar o modal quando necessário
    document.getElementById("span-fechar-modal-confirmacao").addEventListener("click", fecharModalConfirmacao)
    document.getElementById("botao-fechar-modal-confirmacao").addEventListener("click", fecharModalConfirmacao)
    const botaoAgendar = document.getElementById("botao-agendar-modal-confirmacao")
    const inputs = document.getElementsByClassName("inputSelecionar")
    botaoAgendar.disabled = true

    botaoAgendar.addEventListener('click', () => {
        let idServico = ""

        for(let i = 0; i < inputs.length ; i++)
            if(inputs[i].checked) idServico = inputs[i].value
            
        agendar(data, idServico)
    })
    // Busca os Agendamentos no Banco de Dados e Popula o Modal
    buscarAgendamentos(data)
} 
// Fechar Modal de Confirmação
const fecharModalConfirmacao = () => {
    const containerAgendamentos = document.getElementById("container-agendamentos")
    containerAgendamentos.style.opacity = "0"

    const modal = document.getElementsByClassName("container-modal-confirmacao")[0]
    modal.classList.remove("aberto")
}

// Popular o modal com os agendamentos
const popularModalConfirmacao = (servicos = [], emailCliente = 0, data = "", dados = {}) => {

    // Popular Detalhes do Agendamento
    document.getElementById("nome-modal").innerHTML = `E-Mail: <span>${emailCliente}</span>`   // E-Mail Cliente
    document.getElementById("data-modal").innerHTML = `Data: <span>${data}</span>`          // Data do Agendamento

    document.getElementById("container-detalhes").style.opacity = "1"

    const containerAgendamentos = document.getElementById("container-agendamentos")
    let servicosHTML = ""
    for(let i = 0; i<servicos.length; i++) 
    {
        const servico = servicos[i]

        servicosHTML +=`
        <div class="agendamento">
            <input class="inputSelecionar" type="radio" name="radio" id="radio1" value="${servico.servicoId}" ${servico.disponivel?"":"disabled"}/>
            <div class="cabecalho-agendamento ${servico.disponivel?"":"indisponivel"}">
                <label>${servico.nome}</label>
            </div>
            <div class="corpo-agendamento">
                <h2 class="${servico.disponivel?"":"indisponivel"}">${servico.disponivel?"DISPONÍVEL":"INDISPONÍVEL"}</h2>
                <h3>R$ ${parseInt(servico.preco)},00</h3>
            </div>
        </div>
        `
    }
    containerAgendamentos.innerHTML = servicosHTML
    containerAgendamentos.style.opacity = "1"

    const botaoAgendar = document.getElementById("botao-agendar-modal-confirmacao")
    const inputs = document.getElementsByClassName("inputSelecionar")
    for(let i=0; i<inputs.length; i++){
        inputs[i].addEventListener("input", ()=>{
            let checked = false
            for(let e=0; e<inputs.length; e++)
                if(inputs[e].checked)
                    checked = true
            checked ? botaoAgendar.disabled = false: botaoAgendar.disabled = true
        })
    }
}

window.onload = apagarDias