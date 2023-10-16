const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT

const { CadastroCliente, LoginCliente } = require('./Controllers/ControllerCliente')
routes.post('/Cadastro', CadastroCliente)
routes.post('/LoginCliente', LoginCliente)

const { LoginAdmin } = require('./Controllers/ControllerAdmin')
routes.post('/LoginAdmin', LoginAdmin)

module.exports = routes;