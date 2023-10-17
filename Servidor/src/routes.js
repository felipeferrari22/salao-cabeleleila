const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT

const { BuscarServicos, authJWT } = require('./Controllers/ControllerUsuario')
routes.get('/BuscarServicos', AuthTokenAcesso, BuscarServicos)
routes.get('/authJWT', AuthTokenAcesso, authJWT)

const { CadastroCliente, LoginCliente, SolicitarAgendamento, BuscarMeusAgendamentos } = require('./Controllers/ControllerCliente')
routes.post('/Cadastro', CadastroCliente)
routes.post('/LoginCliente', LoginCliente)
routes.post('/SolicitarAgendamento', AuthTokenAcesso, SolicitarAgendamento)
routes.get('/BuscarMeusAgendamentos', AuthTokenAcesso, BuscarMeusAgendamentos)

const { 
    CadastroAdmin,
    LoginAdmin,
    CriarServico,
    DeletarServico,
    ModificarServico,
    BuscarSolicitacoes,
    AprovarSolicitacoes,
    DeletarSolicitacoes,
    BuscarAgendamentos
 } = require('./Controllers/ControllerAdmin')
routes.post('/CadastroAdmin', CadastroAdmin)
routes.post('/LoginAdmin', LoginAdmin)
routes.post('/CriarServico', AuthTokenAcesso, CriarServico)
routes.delete('/DeletarServico/:id', AuthTokenAcesso, DeletarServico)
routes.put('/ModificarServico/:id', AuthTokenAcesso, ModificarServico)
routes.get('/BuscarSolicitacoes', AuthTokenAcesso, BuscarSolicitacoes)
routes.put('/AprovarSolicitacoes/:id', AuthTokenAcesso, AprovarSolicitacoes)
routes.delete('/DeletarSolicitacoes/:id', AuthTokenAcesso, DeletarSolicitacoes)
routes.get('/BuscarAgendamentos', AuthTokenAcesso, BuscarAgendamentos)

module.exports = routes;