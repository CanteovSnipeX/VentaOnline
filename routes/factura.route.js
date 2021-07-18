"use strict"

var express = require("express");
var facturaController = require("../controllers/factura.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/addFactura",mdAuth.ensureUser,facturaController.addFactura);
api.get("/getFactura",mdAuth.ensureUser,facturaController.getFactura);
api.get("/getProductosfactura/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],facturaController.getProductosfactura,);
api.get("/getMasProductos",mdAuth.ensureUser,facturaController.getMasProductos);

module.exports = api;