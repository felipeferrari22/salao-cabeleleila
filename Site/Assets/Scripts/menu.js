/**
 * Script utilizado no funcionamento do
 * calendáro da página de agendamentos (Admin)
 */


// Abrir Modal de Detalhes
const abrirModal = (data) => {
    const modal = document.getElementsByClassName("container-modal-detalhes")[0]
    modal.classList.add("aberto")

    // Adiciona os EventListeners para fechar o modal quando necessário
    document.getElementById("span-fechar-modal").addEventListener("click", fecharModal)
    document.getElementById("botao-fechar-modal").addEventListener("click", fecharModal)

    // Indica a data em questão no cabeçalho do modal
    const dataModal = modal.children[0].children[1].children[1]
    dataModal.innerHTML = data
    // Busca os agendamentos no Banco de Dados e Popula o Modal
    buscarAgendamentos(data)
} 
// Fechar Modal de Detalhes
const fecharModal = () => {
    const containerAgendamentos = document.getElementById("container-agendamentos")
    containerAgendamentos.style.opacity = "0"

    const modal = document.getElementsByClassName("container-modal-detalhes")[0]
    modal.classList.remove("aberto")
}

// Popular o modal com os agendamentos
const popularModalDetalhes = (dados) => {
    const containerAgendamentos = document.getElementById("container-agendamentos")
    let agendamentosHTML = ""
    for(let i = 0; i<dados.length; i++) 
    {
        const agendamento = dados[i]

        agendamentosHTML +=`
            <div class="agendamento">
                <div class="cabecalho-agendamento">
                    <h1>${agendamento.servico}</h1>
                </div>
                <div class="corpo-agendamento">
                    <p>Cliente: <span>${agendamento.cliente}</span></p>
                    <p>Agendado Desde: <span>${agendamento.desde}</span></p>
                    <p>Preço do Agendamento: <span>${agendamento.preco}</span></p>
                </div>
            </div>
            `
    }
    containerAgendamentos.innerHTML = agendamentosHTML
    containerAgendamentos.style.opacity = "1"
}


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
            buscarDatas()
            // Formata data de YYYY-MM-DD -> DD/MM/YYYY
            const data = e.target.getAttribute("data-calendar-day")
            const dia = data.split("-")[2]
            const mes = data.split("-")[1]
            const ano = data.split("-")[0] 
            const dataFormatada = `${dia}/${mes}/${ano}`
            
            // Abre o Modal (Overlay) de detalhes
            abrirModal(dataFormatada)
        },

        clickMonth() {
            buscarDatas()
        },

        clickYear() {
            buscarDatas()
        },
    }
}).init()

// Chamado caso hajam datas sem agendamentos
const apagarDias = (datas) => {
    
    // Formata datas de DD/MM/YYYY -> YYYY-MM-DD
    datas = datas.map(data => {
        const dia = data.split("/")[0]
        const mes = data.split("/")[1]
        const ano = data.split("/")[2]

        return `${ano}-${mes}-${dia}`
    })
    
    // Para todo dia, verifíca se há agendamentos e modifica sua classe de acordo
    const dias = document.getElementsByClassName("vanilla-calendar-day__btn")
    for(let i = 0; i < dias.length; i++)
    {
        const dia = dias[i]

        if(datas.includes(dia.getAttribute("data-calendar-day"))) {
            dia.disabled = false
            dia.classList.add("com-agendamento")
        } else {
            dia.disabled = true
            dia.classList.remove("com-agendamento")
        }
    }
}
