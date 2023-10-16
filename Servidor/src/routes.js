const express = require("express");
const routes = new express.Router();

const { AuthTokenAcesso } = require('./Middlewares') // Middleware de Auth do JWT