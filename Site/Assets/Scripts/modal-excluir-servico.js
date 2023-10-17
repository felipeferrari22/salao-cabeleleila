/**
 * Script controlador do modal de
 * exclusão de serviço na página Admin/servicos.html
 */

// Função que fecha o modal
const fecharModalExcluirServico = () => {
    // Abre o modal
    const modal = document.getElementById("container-modal-excluir-servico")
    modal.classList.remove("aberto")
}

// Função de excluir o serviço
const excluirServico = (objectId) => {
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

    fetch(`http://localhost:3000/DeletarServico/${objectId}`, {
        method: "DELETE",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        console.log({res})
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log("Serviço excluido")
            alert("Serviço excluído com sucesso!")
            fecharModalExcluirServico()
            location.reload()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que abre o modal com os dados do serviço em questão
const abrirModalExcluirServico = (objectId, nome, valor) => {
    // Popula os dados
    document.getElementById("span-nome-servico").innerHTML = nome
    document.getElementById("span-valor-servico").innerHTML = `R$${valor},00`

    // Atribui as funções de fechar aos respectivos botões
    document.getElementById("span-fechar-modal-excluir-servico")
    .addEventListener("click", fecharModalExcluirServico)
    document.getElementById("botao-fechar-modal-excluir-servico")
    .addEventListener("click", fecharModalExcluirServico)

    // Atribui a função de excluir o serviço
    document.getElementById("botao-excluir-modal-excluir-servico")
    .addEventListener("click", () => excluirServico(objectId))

    // Abre o modal
    const modal = document.getElementById("container-modal-excluir-servico")
    modal.classList.add("aberto")
}

// Busca todos os botões "Excluir" e atribui a func. de abrir modal p/ o evento "click"
const atribuir_abrirModalExcluir = () => {
    const botoesAbrirModalExcluir = document.getElementsByClassName("excluir-servico")
    for(let i = 0; i<botoesAbrirModalExcluir.length; i++)
    {
        const botao = botoesAbrirModalExcluir[i]
        // Busca os dados salvos como atributos no HTML
        const objectIdServico = botao.getAttribute("objectId")
        const nomeServico = botao.getAttribute("nome")
        const valorServico = botao.getAttribute("valor")
        // Adiciona o eventlistener
        botao.addEventListener("click", () => abrirModalExcluirServico(objectIdServico, nomeServico, valorServico))
    }
}

setTimeout(atribuir_abrirModalExcluir, 1000)