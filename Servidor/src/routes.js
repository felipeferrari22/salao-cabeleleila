const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT

const { BuscarServicos, authJWT } = require('./Controllers/ControllerUsuario')
routes.get('/BuscarServicos', AuthTokenAcesso, BuscarServicos)
routes.get('/authJWT', AuthTokenAcesso, authJWT)

const { CadastroCliente, LoginCliente } = require('./Controllers/ControllerCliente')
routes.post('/Cadastro', CadastroCliente)
routes.post('/LoginCliente', LoginCliente)

const { 
    LoginAdmin,
    CriarServico,
    DeletarServico,
    ModificarServico
 } = require('./Controllers/ControllerAdmin')
routes.post('/LoginAdmin', LoginAdmin)
routes.post('/CriarServico', AuthTokenAcesso, CriarServico)
routes.delete('/DeletarServico/:id', AuthTokenAcesso, DeletarServico)
routes.put('/ModificarServico/:id', AuthTokenAcesso, ModificarServico)

module.exports = routes;