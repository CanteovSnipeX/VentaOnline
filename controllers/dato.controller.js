"use strict"

var Dato = require('../models/dato.model');
var Factura = require('../models/factura.model');
var Categoria = require('../models/categoria.model');
var Producto = require('../models/producto.model');
var Carrito = require('../models/carrito.model');
var bcrypt =  require('bcrypt-nodejs');
var jwt = require('../services/jwt')

//ADMIN
function prueba (req, res){
    res.status(200).send({message:'Correcto'});
}

function admin (req,res){
    Dato.findOne({username: "ADMIN"},(err,adminFind)=>{
        if(err){
            return res.status(500).send({message: "Error general en el servidor al iniciar"});
        }else if(adminFind){
            console.log("El usuario ADMIN ya existe");
            return res.send({message: "El usuario ADMIN ya existe"});
        }else{
            var dato = new Dato();
            bcrypt.hash("12345",null,null,(err,passwordHashed)=>{
                if(err){
                    return res.status(500).send({message: "Error al encriptar la contraseña de ADMIN"});
                }else if(passwordHashed){
                    dato.username = "ADMIN";
                    dato.password = passwordHashed;
                    dato.role = "ROLE_ADMIN";
                    dato.save((err,datoSaved)=>{
                        if(err){
                            return res.status(500).send({message: "Error al crear el usuario admin"});
                        }else if(datoSaved){
                            console.log("El usuario ADMIN creado exitosamente");
                            return res.send({message: "Usuario admin creado exitosamente",datoSaved});
                        }else{
                            return res.status(404).send({message: "No se creo el usuario admin"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "No se encriptó la contraseña"});
                }
            })
        }
    })
}

function login (req, res){
    var params = req.body;

    if(params.username && params.password){
        Dato.findOne({username: params.username}, (err, datoFind)=>{
            if(err){
                return res.status(500).send({message: 'Error'});
            }else if(datoFind){
                bcrypt.compare(params.password,datoFind.password,(err,checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error en la contraseña'});
                    }else if(checkPassword){
                        if(params.gettoken){
                            return res.send({token: jwt.createToken(datoFind)});
                        }else{
                            return res.send({message: "¡Bienvenido!"});
                        }
                    }else{

                        return res.status(404).send({message: '🚨Contraseña erronea🚨'})
                    }
                })
            }else{
                return res.send({message: "Usuario inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingreselos el usuario o la contraseña"});
    }
}

function saveDatos (req, res){
    var params = req.body;
    var dato = new Dato();

    if(params.name && params.lastname && params.username && params.password && params.email && params.phone){
        Dato.findOne({username: params.username},(err,datoFind)=>{
            if(err){
                return res.status(500).send({message: "Error"});
            }else if(datoFind){
                return res.send({message: "Usuario ya utilizado 🙆🏽‍♂️"});
            }else{
                bcrypt.hash(params.password, null, null, (err,passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: "Error al encriptar contraseña"});
                    }else if(passwordHash){
                            dato.name = params.name;
                            dato.lastname = params.lastname;
                            dato.username = params.username;
                            dato.password = passwordHash;
                            dato.email = params.email;
                            dato.phone = params.phone;
                            if(params.role == "ROLE_ADMIN"){
                                dato.role = "ROLE_ADMIN";
                            }else{
                                dato.role = "ROLE_CLIENTE";
                            }
                            dato.save((err,datoSaved)=>{
                                if(err){
                                    return res.status(500).send({message: "Error en el servidor al guardar"});
                                }else if(datoSaved){
                                    return res.send({message: "Guardado exitosamente 👍🏽 ",datoSaved});
                                }else{
                                    return res.status(404).send({message: "No se guardó la empresa"});
                                }
                        })
                    }else{
                        return res.status(404).send({message: "No se encriptó la contraseña"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos"});
    }
}

function  updateDatos (req, res){
    let datoId = req.params.id;
    let update = req.body;

    if(update.password){
        return res.status(500).send({message: 'No se puede actualizar '})
    }else{
        Dato.findOne({username: params.username},(err, datoFind)=>{
            if(err){
                return  res.status(500).send({message:'Error'});
            }else if(datoFind){
                return res.status.send({message: 'Nombre de usuario ya existente, no se puede actualizar su cuenta'});
            }else{
                Dato.findByIdAndUpdate(datoId,update,{new:true},(err,datoUpdate)=>{
                    if(err){
                       return res.status(500).send({message:'Error al actualizar'});
                    }else if(datoUpdate){
                        return res.status.send({message: 'Actualizacion Correcta', datoUpdate});
                    }else{
                        return res.status(404).send({message: 'No se pudo Actualizar'});
                    }
                })
            }
        })
    }
}

function removeDatos (req, res){
    let datoId = req.params.id;

    Dato.findOne({_id:datoId},(err,datoFind)=>{
        if(err){
            return res.status(500).send({message: "Error al intentar eliminar"});
        }else if(datoFind){
            Dato.findByIdAndRemove(datoId,(err, datoFind)=>{
                if(err){
                    return res.status(500).send({message: "Error al intentar eliminar"});
                }else if(datoFind){
                    return res.send({message: "Eliminacion Exitosa 🎉"});
                }else{
                    return res.status(404).send({message: "No se pudo eliminar"});
                }
            })
        }else{
            return res.status(500).send({message: "Dato inexistente o ya fue eliminado"});
        }
    })
}

function getDatos (req, res){
        Dato.find({}).populate("dato").exec((err,clientes)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener datos"});  
            }else if(clientes){
                return res.send({message: "Clientes:", clientes});
            }else{
                return res.status(403).send({message:'No hay Registros'});
            }
        })
}


//Cliente
function searchProduct (req, res){
    let proName = req.body;
    
    Producto.findOne(proName).exec((err, product)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor al intentar buscar'});
        }else if(proName){
            res.status(200).send({message: 'Producto', product});
        }else{
            res.status(200).send({message: 'No hay registros'});
        }
    })
}

function getCatalogo (req, res) {
    Categoria.find({}).populate("categoria").exec((err,catalogo)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener datos"});  
        }else if(catalogo){
            return res.send({message: "Catalogo:", catalogo});
        }else{
            return res.status(403).send({message:'No hay Registros'});
        }
    })  
}

function updateCliente(req, res) {
    let datoId = req.params.id;
    let update = req.body;

    if(update.password){
        return res.status(500).send({message: 'No se puede actualizar '})
    }else{
        Dato.findOne({username: params.username},(err, datoFind)=>{
            if(err){
                return  res.status(500).send({message:'Error'});
            }else if(datoFind){
                return res.status.send({message: 'Nombre de Usuario ya existente, no se puede actualizar su cuenta'});
            }else{
                Dato.findByIdAndUpdate(datoId,update,{new:true},(err,datoUpdate)=>{
                    if(err){
                       return res.status(500).send({message:'Error al actualizar'});
                    }else if(datoUpdate){
                        return res.status.send({message: 'Actualizacion Correcta', datoUpdate});
                    }else{
                        return res.status(404).send({message: 'No se pudo Actualizar'});
                    }
                })
            }
        })
    }  
    
}
 

function removeCliente (req, res) {
    let datoId = req.params.id;
    let params = req.body;
 
    if(pasams.password){
        return res.status(500).send({message: 'No se puede Eliminar '})
            }else{           
                Dato.findOne({_id:datoId},(err,datoFind)=>{
                if(err){
                    return res.status(500).send({message: "Error al intentar eliminar"});
                }else if(datoFind){
                    Dato.findByIdAndRemove(datoId,(err, datoFind)=>{
                        if(err){
                            return res.status(500).send({message: "Error al intentar eliminar"});
                        }else if(datoFind){
                            return res.send({message: "Eliminacion Exitosa 🎉"});
                        }else{
                            return res.status(404).send({message: "No se pudo eliminar"});
                        }
                    })
                }else{
                return res.status(500).send({message: "Dato inexistente o ya fue eliminado"});
            }
        })  
    }
}


module.exports = {
    prueba,
    admin,
    login,
    saveDatos,
    updateDatos,
    removeDatos,
    getDatos,
    //cliente
    getCatalogo,
    searchProduct,
    updateCliente,
    removeCliente, 
}