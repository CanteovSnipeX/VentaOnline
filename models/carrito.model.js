"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carritoSchema = Schema ({
    compra: Boolean,
    cliente: {type: Schema.ObjectId, ref:"dato"},
    products: [{type: Schema.ObjectId, ref:"productos"}],
    stock: [Number]
});

module.exports = mongoose.model("carrito", carritoSchema);