/**
 Este script será utilizado para controlar o modal de criação de serviços,
 que está escrito na tela de gerenciamento de serviços
 */

//Função de fechar o modal
const fecharModalCriarServico= () => {
    const modal= document.getElementById("container-modal-criar-servico")
    modal.classList.remove("aberto")
  }
  
  // função que abre o modal
  const abrirModalCriarServico = () => {
    const modal = document.getElementById("container-modal-criar-servico")
    modal.classList.add("aberto")
  
    //Atribui a função de fechar aos botões correspondentes
    document.getElementById("fechar-modal-criar-servico").addEventListener("click", fecharModalCriarServico)
    document.getElementById("botao-cancelar").addEventListener("click", fecharModalCriarServico)
  
    // Verifica o status do botão criar de acorco com o valor do input
    const botaoCriar = document.getElementById("botao-criar")
    const inputNomeServico = document.getElementById("nome-servico")
    const inputValorServico = document.getElementById("valor-servico")
  
    //Função de validação dos inputs para colocar/tirar o disabled no botão de criar
    const validarInputs = () => {
      let validacao = 0
      inputNomeServico.value !== "" ? validacao++ : null //nome do serviço
      inputValorServico.value >= 0 ? validacao++ : null //valor do serviço
  
      //Se os dois testes forem verdadeiros, o disable é retirado do botão
      validacao === 2 ? botaoCriar.disabled = false: botaoCriar.disabled = true
    }
  
    //Atribui a função de validação nos dois campos <input>
    inputNomeServico.addEventListener("input", validarInputs)
    inputValorServico.addEventListener("input", validarInputs)
  
    //EventListener para atribuir função de criação de serviço
    botaoCriar.addEventListener("click", ()=>{
      criarServico(inputNomeServico.value, inputValorServico.value, [inputNomeServico, inputValorServico])
    })}
  
  const criarServico = (nome, valor, inputs) => {
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
  
    fetch(`http://localhost:3000/CriarServico`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        body: JSON.stringify({
            nome: nome,
            preco: valor
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
            console.log("Espaço cadastrado")
            fecharModalCriarServico()
            alert("Serviço criado com sucesso!")
            location.reload()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Ocorreu um erro")
    })
  }
  
  //Atribui a função de criar serviço ao evento "click" do botão de criar Serviço
  document.getElementById("botao-novo-servico").addEventListener("click", abrirModalCriarServico)
  
  