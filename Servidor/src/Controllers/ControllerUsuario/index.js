const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

/**
 * @api {get} /BuscarServicos Buscar Serviços
 * @apiName Buscar Serviços
 * @apiGroup Serviços
 * @apiVersion 1.0.0
 * 
 * @apiPermission Admin, Cliente
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 *  
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Busca feita com sucesso",
 *  espaco: [{id, nome, preco}, ...]
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na busca de serviços",
 *  error: {errorObject}
 * }
 */

const BuscarServicos = (req, res) => {
    const main = async () => {
        const servicos = await prisma.servicos.findMany()

        const dados = servicos.map((servicoAtual) => {
            return {
                id: servicoAtual.id,
                nome: servicoAtual.nome,
                preco: servicoAtual.preco
            }
        })

        return res.status(200).send({message: "Busca feita com sucesso", servicos: dados})
    }
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca do serviço", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

module.exports = {
    BuscarServicos,
    authJWT(req, res){
        return res.status(200).send({message: "Token de acesso autêntificado"})
    }
}