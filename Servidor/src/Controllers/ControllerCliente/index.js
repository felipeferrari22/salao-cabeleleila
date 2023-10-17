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
                id: cliente.id
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

module.exports = {
    CadastroCliente,
    LoginCliente
}