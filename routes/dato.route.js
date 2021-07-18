'use strict'

var express = require('express');
var datoController = require('../controllers/dato.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

//Datos
api.get('/prueba',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],datoController.prueba);
//api.post("/admin",datoController.admin);
api.post('/login',mdAuth.ensureAuth,datoController.login); //no
api.post('/saveDatos',mdAuth.ensureAuth,datoController.saveDatos);//no
api.put('/updateDatos/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],datoController.updateDatos);//si
api.delete('/removeDatos/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],datoController.removeDatos);//si
api.get('/getDatos',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],datoController.getDatos);//si

//cliente
api.get('/getCatalogo',mdAuth.ensureAuth,datoController.getCatalogo);
api.post('/searchProduct',mdAuth.ensureAuth,datoController.searchProduct);
api.put('/updateCliente',mdAuth.ensureAuth,datoController.updateCliente);
api.put('/removeCliente',mdAuth.ensureAuth,datoController.removeCliente);


module.exports = api;

