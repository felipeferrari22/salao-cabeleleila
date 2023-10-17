/**
 * Script referente ao controlador do modal
 * de modificação de serviços do painel Admin
 * (Admin/servicos.html)
 */

// Função que fecha o modal
const fecharModalModificarServico = () => {
    const modal = document.getElementById("container-modal-modificar-servico")
    modal.classList.remove("aberto")
}

// Função que modifica os dados do serviço
const modificarServico = (objectId, novoNome, novoValor) => {
    // Busca JWT nos Cookies
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

    fetch(`http://localhost:3000/ModificarServico/${objectId}`, {
        method: "PUT",
        headers: {
            "auth": `${JWT}`,
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            nome: novoNome ? novoNome : "",
            valor: novoValor ? novoValor : "",
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log("Alterações salvas")
            alert("Alterações salvas com sucesso!")
            fecharModalModificarServico()
            location.reload()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que abre o modal
const abrirModalModificarServico = (objectId, nomeAtual, valorAtual) => {
    const modal = document.getElementById("container-modal-modificar-servico")
    const botaoFechar = document.getElementById("botao-fechar-modal-modificar-servico")
    const spanFechar = document.getElementById("span-fechar-modal-modificar-servico")
    const botaoSalvar = document.getElementById("botao-modificar-modal-modificar-servico")

    // Atribui a função de fechar o modal
    botaoFechar.onclick = fecharModalModificarServico
    spanFechar.onclick = fecharModalModificarServico

    // Popula o HTML do modal com os detalhes do serviço
    const detalhesServico = document.getElementById("modal-modificar-servico").children[2]
    detalhesServico.innerHTML = `
    <p>Nome Atual: <span>${nomeAtual}</span></p>
    <p>Valor Atual: <span>${valorAtual}</span></p>
    `

    // Atribui uma verificação para casos onde o botão de salvar é disabilitado
    const inputNome = document.getElementById("nome-modificar-servico")
    const inputValor = document.getElementById("valor-modificar-servico")
    const validarInputs = () => {
        if ((inputValor.value !== "" && inputValor.value < 0) || inputNome.value + inputValor.value === "" )
            botaoSalvar.disabled = true
        else 
            botaoSalvar.disabled = false
    }
    inputNome.oninput = validarInputs
    inputValor.oninput = validarInputs

    // Atribui a função de salvar modificações
    botaoSalvar.onclick = () => { modificarServico(objectId, inputNome.value, inputValor.value) }

    modal.classList.add("aberto")
}

// Busca todos os botões "Modificar" e atribui a func. de abrir modal p/ o evento "click"
const atribuir_abrirModalModificar = () => {
    const botoesAbrirModalExcluir = document.getElementsByClassName("modificar-servico")
    for(let i = 0; i<botoesAbrirModalExcluir.length; i++)
    {
        const botao = botoesAbrirModalExcluir[i]
        // Busca os dados salvos como atributos no HTML
        const objectIdServico = botao.getAttribute("objectId")
        const nomeServico = botao.getAttribute("nome")
        const valorServico = botao.getAttribute("valor")
        // Adiciona o eventlistener
        botao.addEventListener("click", () => abrirModalModificarServico(objectIdServico, nomeServico, valorServico))
    }
}

setTimeout(atribuir_abrirModalModificar, 1000)