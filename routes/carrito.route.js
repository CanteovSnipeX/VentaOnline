"use strict"

var express = require("express");
var carritoController = require('../controllers/carrito.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.put('/addToCarrito/:id',mdAuth.ensureUser,carritoController.addToCarrito);

module.exports = api;