"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var datoSchema = Schema({
    name: String ,
    lastname: String, 
    username: String,
    password: String,
    email: String,
    phone: Number,
    role: String,
      factura:[{type: Schema.ObjectId, ref:'factura'}],
      carrito:[{type: Schema.ObjectId, ref:'carrito'}]
});


module.exports = mongoose.model("datos", datoSchema);