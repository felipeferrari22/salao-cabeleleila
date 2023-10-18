const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

const CadastroAdmin = (req, res) => {    
    const main = async () => {
        
        const {email, senha} = req.body
        const {HashPwd} = require('./../../Services')
        
        try{
            await prisma.admin.create({
                data: {
                    email: email,
                    senha: await HashPwd(senha)
                }
            })
        }catch(err){
            //Erro previsto pelo Prisma -> Linha já existente
            if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") { 
                return res.status(400).send({message: "Admin já estava cadastrado", error: err})
            } else {
                throw err;
            }
        }
        
        return res.status(201).send({message: "Admin Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do Admin", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
};

/**
 * @api {post} /LoginAdmin Logar Admin
 * @apiName LoginAdmin
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * 
 * @apiPermission Nenhuma
 * 
 * @apiBody {String} email E-mail do Admin
 * @apiBody {String} senha Senha do Admin  
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

const LoginAdmin = async (req, res) => {
    const {email, senha} = req.body
    const { AuthPwd } = require('../../Services')
        
    const admin = await prisma.admin.findUnique({
        // Confere se o admin foi cadastrado
        where: {
            email: email,
        }
    })

    if(admin){
        // Autentifica a Senha inserida
        if(await AuthPwd(admin.senha, senha)) {
                const dados = {
                    email: admin.email,                    
                    id: admin.id,
                    belongsTo: "ADMIN"
                }
                // Token de Acesso enviado ao usuário p/ autentificar
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
 * @api {post} /CriarServico Criar Serviço
 * @apiName CriarServico
 * @apiGroup Serviços
 * @apiVersion 1.0.0
 * 
 * @apiPermission Admin
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 * 
 * @apiBody {String} nome Nome do serviço  
 * @apiBody {Number} preco Preço do serviço
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Serviço Cadastrado"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Serviço já estava cadastrado"
 * }
 */

const CriarServico = (req, res) => {    
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {nome, preco} = req.body
        try{
            await prisma.servicos.create({
                data: {
                    nome: nome,
                    preco: preco
                }
            })
        }catch(err){
            //Erro previsto pelo Prisma -> Linha já existente
            if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") { 
                return res.status(400).send({message: "Serviço já estava cadastrado", error: err})
            } else {
                throw err;
            }
        }
        return res.status(201).send({message: "Serviço Cadastrado"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro no cadastro do serviço", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {delete} /DeletarServico/:id Deletar Serviço
 * @apiName Deletar Serviço
 * @apiGroup Serviços
 * @apiVersion 1.0.0
 * 
 * @apiPermission Admin
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 * 
 * @apiParam {Number} id ID do Serviço
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Serviço removido com sucesso"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na remoção do serviço",
 *  error: {errorObject}
 * }
 */

const DeletarServico = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const id = req.params.id

        // Busca o serviço via ID
        const servicos = await prisma.servicos.findUnique({
            where: {
                id: parseInt(id),
            },
        })
        if(servicos === null) return res.status(404).send({message: "Serviço não encontrado"})

        await prisma.servicos.delete({
            where: {id: parseInt(id)}
        })
        await prisma.agendamento.delete({
            where: {servicos_id: parseInt(servicos.id)}
        })
        return res.status(200).send({message: "Serviço removido com sucesso"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na remoção do serviço", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {put} /ModificarServico/:id Modificar Serviço
 * @apiName Modificar Serviço
 * @apiGroup Serviços
 * @apiVersion 1.0.0
 * 
 * @apiPermission Admin
 * @apiHeader {String} auth Token de acesso JWT
 * @apiHeaderExample {json} Exemplo de Header:
 * {
 *  "auth": [Token de Acesso JWT]
 * }
 * 
 * @apiParam {Number} id ID do Serviço
 * @apiBody {String} nome Nome do serviço  
 * @apiBody {Number} preco Preço do serviço
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Serviço removido com sucesso"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na remoção do serviço",
 *  error: {errorObject}
 * }
 */

const ModificarServico = async (req, res) => {
    const main = async () => {
        if (req.dados.belongsTo !== "ADMIN") {
            return res.status(403).send({ message: "Permissão negada [!Admin]" });
        }

        const id = req.params.id
        const { nome, preco } = req.body;

        const servicos = await prisma.servicos.update({
            where: {
                id: parseInt(id),
            },
            data: {
              nome: nome,
              preco: preco
            },
          })
        if (servicos === null) return res.status(404).send({ message: "Serviço não encontrado" });
        return res.status(200).send({ message: "Serviço modificado com sucesso" });
    }
     
    main()
        .catch((err)=>{res.status(400).send({message: "Erro na modificação do serviço", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
};

/**
 * @api {get} /BuscarSolicitacoes Buscar Solicitações
 * @apiName Buscar Solicitações
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
 *  usuarios: [{id, data, horario_entrada, horario_saida, status, usuario_nome, usuario_empresa}, ...]
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na busca de solicitações",
 *  error: {errorObject}
 * }
 */

const BuscarSolicitacoes = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const solicitacoes = await prisma.agendamento.findMany({
            where: {status: "Pendente"}
        })

        const dados = await Promise.all(solicitacoes.map(async (solicitacaoAtual) => {
            
            const cliente = await prisma.cliente.findUnique({
                where: {id: parseInt(solicitacaoAtual.cliente_id)}
            })
            const servicos = await prisma.servicos.findUnique({
                where: {id: parseInt(solicitacaoAtual.servicos_id)}
            })

            return {
                id: solicitacaoAtual.numero_agendamento,
                data: solicitacaoAtual.data,
                hora: solicitacaoAtual.hora,
                status: solicitacaoAtual.status,
                servicos: solicitacaoAtual.servicos,
                preco: servicos.preco,
                cliente_nome: cliente.nome
            }
        }))

        return res.status(200).send({message: "Busca feita com sucesso", solicitacoes: dados})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na busca de solicitações", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {put} /AprovarSolicitacoes/:id Aprovar Solicitação
 * @apiName Aprovar Solicitação
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
 * @apiParam {Number} id Número da Solicitação
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Solicitação Aprovada"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na aprovação",
 *  error: {errorObject}
 * }
 */

const AprovarSolicitacoes = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const id = req.params.id

        //==============================

        // 1# Buscar Agendamentos Aprovados e Solicitação Atual
        const aprovados = await prisma.agendamento.findMany({
            where: {status: "Aprovado"}
        })
        const agendamento = await prisma.agendamento.findUnique({
            where: {numero_agendamento: parseInt(id)}
        })

        let existeConflito = false
        
        // 2# Comparar cada um para verificar choques
        aprovados.forEach((aprovAtual) => {
            if(aprovAtual.data === agendamento.data && aprovAtual.servicos_id === agendamento.servicos_id) {
                existeConflito = true
            }
        })

        if(existeConflito) return res.status(401).send({message: "Serviço indisponível neste horário!"})

        //==============================

        try{
            await prisma.agendamento.update({
                where: {
                    numero_agendamento: parseInt(id),
                },
                data: {
                    status: 'Aprovado',
                },
            })

        }catch(err){
            if(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
                return res.status(404).send({message: "Solicitação não encontrada"})
            } else {
                throw err;
            }
        }

        return res.status(200).send({message: "Solicitação aprovada"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na aprovação", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

/**
 * @api {delete} /DeletarSolicitacoes/:id Deletar Solicitação
 * @apiName Deletar Solicitação
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
 * @apiParam {Number} id Número da Solicitação
 * 
 * @apiSuccessExample Exemplo de Sucesso:
 * {
 *  message: "Solicitação removida com sucesso"
 * }
 * @apiErrorExample Exemplo de Erro:
 * {
 *  message: "Erro na remoção da solicitação",
 *  error: {errorObject}
 * }
 */
const DeletarSolicitacoes = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const id = req.params.id

        const solicitacao = await prisma.agendamento.findUnique({
            where: {
                numero_agendamento: parseInt(id),
            },
        })
        if(solicitacao === null) return res.status(404).send({message: "Solicitação não encontrada"})

        await prisma.agendamento.delete({
            where: {numero_agendamento: parseInt(id)}
        })

        return res.status(200).send({message: "Solicitação removida com sucesso"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na remoção da solicitação", error: err})})
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

const BuscarAgendamentos = (req, res) => {
    const main = async () => {
        if(req.dados.belongsTo !== "ADMIN") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
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
    CadastroAdmin,
    LoginAdmin,
    CriarServico,
    DeletarServico,
    ModificarServico,
    BuscarSolicitacoes,
    AprovarSolicitacoes,
    DeletarSolicitacoes,
    BuscarAgendamentos
}