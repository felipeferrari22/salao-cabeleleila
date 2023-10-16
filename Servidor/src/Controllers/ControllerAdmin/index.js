const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

const LoginAdmin = (req, res) => {    
    const main = async () => {
        const {email, senha} = req.body
        
        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            }
        })


    if(await (admin.senha, senha)) {
            const dados = {
                email: admin.email,                    
                nome: admin.nome,
                id: admin.id
            }
            const accessToken= jwt.sign(
                dados,
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {expiresIn: "1d"}
            )
            return res.status(202).send({accessToken, message: "Login bem-sucedido!", tipo: "admin"})
        } else {
            return res.status(401).send({message: "Senha incorreta"})
        }

    main()
        .catch((err)=>{res.status(400).send(err); throw err})
        .finally(async ()=>{await prisma.$disconnect()})
}
}

module.exports = {
    LoginAdmin
}