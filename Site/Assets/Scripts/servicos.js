/**
 * Script que realiza a busca dos serviços
 * através da API, e popula a página
 * Admin/servicos.html com os cards dos serviços
 */

// Função que popula o HTML com os dados buscados
const popularServicos = (servicos) => {
    // [{id, nome, valor}, {id, nome, valor}, {id, nome, valor}]
    let servicosHTML = ""
    console.log(servicos)
    for(let i = 0; i<servicos.length; i++)
    {
        const servico = servicos[i]

        servicosHTML +=  `
        <div class="servico" id="servico-${i}">
            ${servico.nome}
            <div class="container-opcoes-servico">
                <button type="button" class="modificar-servico" id="modificar-servico-${i}" objectId="${servico.id}" valor="${servico.preco}" nome="${servico.nome}"> Modificar </button>
                <button type="button" class="excluir-servico" id="excluir-servico-${i}" objectId="${servico.id}" valor="${servico.preco}" nome="${servico.nome}"> Excluir </button>
            </div>
        </div> 
        `
    }

    const containerServicos = document.getElementsByClassName("container-servicos")[0]
    containerServicos.innerHTML = servicosHTML
    containerServicos.style.opacity = "1";

}
// Função que realiza a busca dos serviços
const buscarServicos = () => {

    // Tentar ler o JWT dos Cookies da página
    let JWT = ""
    try{
        // Busca o JWT salvo em cookie
        JWT = document.cookie
            .split("; ")
            .find(tag => tag.startsWith("JWT="))
            .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return;                     // -> Caso não haja JWT, a função já retorna
    }

    fetch(`http://localhost:3000/BuscarServicos`, {
        method: "GET",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        console.log(json)
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            Object.keys(json).length > 0 ? popularServicos(json.servicos) : null
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Ocorreu um erro")
    })
}

// Atribui a Função da busca ao evento "onload" da página (window)
window.onload = buscarServicos