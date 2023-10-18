const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

/**
 * @api {post} /CadastroCliente Cadastrar Cliente
 * @apiName CadastroCliente
 * @apiGroup Cliente
 * @apiVersion 1.0.0
 * 
 * @apiPermission Nenhuma
 * 
 * @apiBody {String} email E-mail do cliente
 * @apiBody {String} senha Senha do cliente  
 * @apiBody {String} nome Primeiro nome do cliente  
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Cliente Cadastrado"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Cliente já estava cadastrado"
 * }
 */

const CadastroCliente = (req, res) => {    
    const main = async () => {
        
        const {email, nome, senha} = req.body
        const {HashPwd} = require('./../../Services')
        
        try{
            await prisma.cliente.create({
                data: {
                    email: email,
                    senha: await HashPwd(senha),
                    nome: nome
                }
            })
        }catch(err){
            //Erro previsto pelo Prisma -> Linha já existente
            if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") { 
                return res.status(400).send({message: "Cliente já estava cadastrado", error: err})
            } else {
                throw err;
            }
        }
        
        return res.status(201).send({message: "Cliente Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do cliente", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
};

/**
 * @api {post} /LoginCliente Logar Cliente
 * @apiName LoginCliente
 * @apiGroup Cliente
 * @apiVersion 1.0.0
 * 
 * @apiPermission Nenhuma
 * 
 * @apiBody {String} email E-mail do cliente
 * @apiBody {String} senha Senha do cliente  
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Login bem-sucedido!"
 *  tokenAcesso: [Token de Acesso JWT]
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Senha incorreta"
 * }
 */

const LoginCliente = async (req, res) => {
    const {email, senha} = req.body
    const { AuthPwd } = require('../../Services')
    
    const cliente = await prisma.cliente.findUnique({
        where: {
            email: email,
        }
    })

    if(cliente){
        if(await AuthPwd(cliente.senha, senha)) {
            const dados = {
                email: cliente.email,                    
                nome: cliente.nome,
                id: cliente.id,
                belongsTo: "CLIENTE"
            }
            const accessToken= jwt.sign(
                dados,
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {expiresIn: "1d"}
            )
            return res.status(202).send({accessToken, message: "Login bem-sucedido!"})
        } else {
            return res.status(401).send({message: "Senha incorreta"})
        }
    } else{
        return res.status(404).send({message: "Usuário não cadastrado"})
    }

main()
    .catch((err)=>{res.status(400).send(err); throw err})
    .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {post} /SolicitarAgendamento Solicitar Agendamento
 * @apiName SolicitarAgendamento
 * @apiGroup Solicitações
 * @apiVersion 1.0.0
 * 
 * @apiPermission Cliente
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 * 
 * @apiBody {Int} servicos_id Id do serviço
 * @apiBody {String} data Data do agendamento (DD/MM/YY)
 * @apiBody {String} hora Horário (HH:MM)
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Solicitação realizada"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Serviço não encontrado"
 * }
 */
const SolicitarAgendamento = (req, res) =>  {
    const main = async () => {
        if(req.dados.belongsTo !== "CLIENTE") return res.status(403).send({message: "Permissão negada [!Cliente]"})

        const { servicos_id, data, hora } = req.body

        const servicos = await prisma.servicos.findUnique({
            where: {id: parseInt(servicos_id)}
        })
        if(servicos === null) return res.status(404).send({message: "Serviço não encontrado"})

        await prisma.agendamento.create({
            data: {
                status: "Pendente",
                data: data,
                hora: hora,
                servicos: servicos.nome,
                servicos_id: parseInt(servicos_id),
                cliente_id: parseInt(req.dados.id),
            }
        })

        return res.status(201).send({message: "Solicitação realizada"})
    }

    main()
    .catch((err)=>{res.status(400).send({message: "Erro na solicitação", error: err}); throw err})
    .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {get} /BuscarMeusAgendamentos Buscar Agendamentos do Cliente
 * @apiName Buscar Agendamentos do Cliente
 * @apiGroup Solicitações
 * @apiVersion 1.0.0
 * 
 * @apiPermission Cliente
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 *  
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Busca feita com sucesso",
 *  usuarios: [{id, data, hora, servicos, status}, ...]
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na busca de agendamentos",
 *  error: {errorObject}
 * }
 */

const BuscarMeusAgendamentos = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "CLIENTE") return res.status(403).send({message: "Permissão negada [!Cliente]"})
        
        const cliente_id = parseInt(req.dados.id)

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                status: "Aprovado",
                cliente_id
            }
        })

        const dados = await Promise.all(agendamentos.map(async (agendamentoAtual) => {

            const servicos = await prisma.servicos.findUnique({
                where: {id: parseInt(agendamentoAtual.servicos_id)}
            })

            return {
                id: agendamentoAtual.numero_agendamento,
                data: agendamentoAtual.data,
                hora: agendamentoAtual.hora,
                status: agendamentoAtual.status,
                servicos: agendamentoAtual.servicos,
                preco: servicos.preco,
                cliente_id: agendamentoAtual.cliente_id
            }
        }))

        return res.status(200).send({message: "Busca feita com sucesso", agendamentos: dados})
    }
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de agendamentos", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {get} /BuscarAgendamentos Buscar Agendamentos
 * @apiName Buscar Agendamentos
 * @apiGroup Solicitações
 * @apiVersion 1.0.0
 * 
 * @apiPermission Admin
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 *  
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Busca feita com sucesso",
 *  usuarios: [{id, data, horario, espaco, status}, ...]
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na busca de agendamentos",
 *  error: {errorObject}
 * }
 */

const ClienteBuscarAgendamentos = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "CLIENTE") return res.status(403).send({message: "Permissão negada [!Cliente]"})
        
        const agendamentos = await prisma.agendamento.findMany({
            where: {status: "Aprovado"}
        })

        const dados = await Promise.all(agendamentos.map(async (agendamentoAtual) => {

            const cliente = await prisma.cliente.findUnique({
                where: {id: parseInt(agendamentoAtual.cliente_id)}
            })
            return {
                id: agendamentoAtual.numero_agendamento,
                data: agendamentoAtual.data,
                hora: agendamentoAtual.hora,
                servicos: agendamentoAtual.servicos,
                status: agendamentoAtual.status,
                cliente_nome: cliente.nome
            }
        }))

        return res.status(200).send({message: "Busca feita com sucesso", agendamentos: dados})
    }
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de agendamentos", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

module.exports = {
    CadastroCliente,
    LoginCliente,
    SolicitarAgendamento,
    BuscarMeusAgendamentos,
    ClienteBuscarAgendamentos
}