/**
 * Script utilizado no funcionamento do
 * calendáro (Morador)
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