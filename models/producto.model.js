"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema ({
    name: String,
    precio: Number,
    stock: Number,
});

module.exports = mongoose.model("productos", productoSchema);