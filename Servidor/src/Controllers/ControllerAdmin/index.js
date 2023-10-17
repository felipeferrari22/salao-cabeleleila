const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

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
 * @apiBody {String} preco Preço do serviço
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
        return res.status(200).send({message: "Serviço removido com sucesso"})
    }

    main()
        .catch((err)=>{res.status(400).send({message: "Erro na remoção do serviço", error: err})})
        .finally(async ()=>{await prisma.$disconnect()})
}

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


module.exports = {
    LoginAdmin,
    CriarServico,
    DeletarServico,
    ModificarServico
}