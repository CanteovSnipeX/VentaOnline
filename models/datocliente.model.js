"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var datoclienteSchema = Schema({
    name: String,
    lastname: String, 
    email: String,   
    password: String,
});



module.exports = mongoose.model("datoscliente", datoclienteSchema);