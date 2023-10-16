const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const CadastroCliente = (req, res) => {    
    const main = async () => {
        
        const {email, nome, senha} = req.body
        const {HashPwd} = require('./../../services')
        
        try{
            await prisma.usuario.create({
                data: {
                    email: email,
                    senha: await HashPwd(senha),
                    nome: nome,
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
}