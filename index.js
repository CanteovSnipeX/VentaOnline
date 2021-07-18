
"use strict"

var mongoose = require("mongoose");
var app = require("./app");
var port = 3200;

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify",false);
mongoose.connect("mongodb://localhost:27017/DBExamenFinal", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("Conectado a la DB");
    app.listen(port,() => {
        console.log("Servidor Express 👍");
    })
})
.catch((err)=>{
    console.log("Error al conectarse a la DB",err);
})