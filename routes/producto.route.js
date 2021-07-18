'use strict'

var express = require('express');
var categoriaController = require('../controllers/categoria.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

//Categoria
api.post('/saveCategoria',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.saveCategoria);//si
api.get('/getCategoria',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.getCategoria);//si
api.put('/updateCategoria/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.updateCategoria);//si
api.delete('/removeCategoria/:id',categoriaController.removeCategoria);//si

//Productos
api.get('/getProduct/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],mdAuth.ensureAuth ,categoriaController.getProduct);//si
api.put('/setProducto/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.setProducto);//si
api.put('idC/updateProduct/:idP',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.updateProduct);//si
api.delete('idC/removeProduct/:idP',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],categoriaController.removeProduct);//si


module.exports = api;