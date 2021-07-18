"use strict"

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaSchema = Schema({
    
    name : String,
        producto:[{type: Schema.ObjectId, ref:'productos'}]
});

module.exports = mongoose.model("categoria", categoriaSchema);