"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema ({
    name: String,
    products: [{type: Schema.ObjectId, ref:"productos"}]
});


module.exports = mongoose.model("facturas",facturaSchema);