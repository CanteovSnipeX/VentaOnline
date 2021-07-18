"use strict"
  
var Categoria = require('../models/categoria.model');
var Producto = require('../models/producto.model');

//categorias
function saveCategoria(req, res){
    var categoria = Categoria ();
    var params = req.body;

    if(params.name){
        Categoria.findOne({name: params.name},(err, categoriaFind)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(categoriaFind){
                    return res.send({message: "Categoria ya utilizado 🙆🏽‍♂️"});
                }else{
                    categoria.name = params.name;
                    categoria.save((err, categoriaSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error al guardar los datos'});
                        }else if(categoriaSaved){
                            res.send({message: 'Categoria agregada exitosamente'});
                        }
                    })    
              }
        })
    }else{
        res.status.send({message: 'Por favor ingresa todos los datos obligatorios'})
    }
}

function updateCategoria (req, res) {
     let categoriaId = req.params.id;
     let update = req.body;
                Categoria.findByIdAndUpdate(categoriaId,update,{new:true},(err, categoriaUpdate) => {
                    if(err){
                       return res.status(500).send({message:'Error al actualizar'});
                    }else if(categoriaUpdate){
                        return res.send({message: 'Actualizacion Correcta', categoriaUpdate});
                    }else{
                        return res.status(404).send({message: 'No se pudo Actualizar'});
                  }
        })

}

function removeCategoria (req, res) {
    let categoriaId = req.params.id;

    Categoria.findOne({_id:categoriaId},(err,datoFind) => {
        if(err){
            return res.status(500).send({message: "Error al intentar eliminar"});
        }else if(datoFind){
            Categoria.findByIdAndRemove(categoriaId,(err, datoFind) => {
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

function getCategoria(req, res){
    Categoria.find({}).populate("categoria").exec((err,categoria)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener datos"});  
        }else if(categoria){
            return res.send({message: "Categorias:", categoria});
        }else{
            return res.status(403).send({message:'No hay Registros'});
        }
    })

}

function categoriadeafult(){
    var nombre = "Default"
    Categoria.findOne({name: nombre},(err, categoriaFind)=>{
        if(err){
            console.log("Error al buscar",err);
        }else if(categoriaFind){
            console.log("Categoría default ya existente");
        }else{
            var categoria = new Category();
            categoria.name = "Default";
            categoria.save((err, categoriaSaved)=>{
                if(err){
                    console.log("Error al intentar agregar");
                }else if(categoriaSaved){
                    console.log("Categoría default creada");
                }else{
                    console.log("No se creó la categoría Default");
                }
            })
        }
    })
}


//Productos

function setProducto(req, res) {
    let categoriaId = req.params.id;
    let paramsP = req.body;
    let producto = new Producto();

        Categoria.findById(categoriaId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error'});
            }else if(userFind){
                if(paramsP.name && paramsP.precio && paramsP.stock && paramsP.descripcion){
                    producto.name = paramsP.name;
                    producto.precio = paramsP.precio;
                    producto.stock = paramsP.stock;
                    producto.descripcion = paramsP.descripcion;
                    Categoria.findByIdAndUpdate(categoriaId, {$push:{producto: producto}}, {new: true}, (err, userUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general en el servidor'});
                        }else if(userUpdated){
                            res.status(200).send({message: ' Agregado', userUpdated})
                        }else{
                            res.status(404).send({message: ' No agregado'});
                        }
                    })
                }else{
                    res.status(200).send({message: 'Ingrese los datos mínimos'})
                }
            }else{
                res.status(200).send({message: 'No existe la categoria'});
            }
     });
}

function getProduct(req, res) {
 let categoriaId = req.params.id;
 if(userId != req.user.sub){
        Categoria.find({}).populate("productos").exec((err, p) => {
            if(err){
                return res.status(500).send({message: "Error "});
            }else if(p){
                return res.send({message:"Productos", p});
            }else{
                return res.status(403).send({message: "No hay registros"});
            }
        })
    }else{
        return res.status(500).send({message:'No tienes permisos'})
    }
}

function updateProduct (req, res){
    let categoriaId = req.params.idC;
    let productoId = req.params.idP;
    let update = req.body;

    if(categoriaId != req.datos.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name && update.precio && update.stock && update.descripcion){
            Contact.findById(contactId, (err, contactFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar'});
                }else if(contactFind){
                    User.findOne({_id: categoriaId, productos: productoId}, (err, categoriaFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error'});
                        }else if(categoriaFind){
                            Contact.findByIdAndUpdate(productoId, update, {new: true}, (err, productUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general en la actualización'});
                                }else if(productUpdated){
                                    return res.send({message: 'Actualizado', productUpdated});
                                }else{
                                    return res.status(404).send({message: 'No actualizado'});
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'Categoria  no encontrado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Producto a actualizar inexistente'});
                }
            })
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
        }
    }
}

function removeProduct(req, res){
    let categoriaId = req.params.idC;
    let productoId = req.params.idP;

    if(categoriaId != req.dato.sub){
        return res.status(500).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        User.findOneAndUpdate({_id: categoriaId, productos: productoId},
            {$pull:{productos: productoId}}, {new:true}, (err, productPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(productPull){
                    Contact.findByIdAndRemove(productoId, (err, productRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar '});
                        }else if(productRemoved){
                            return res.send({message: 'eliminado', productPull});
                        }else{
                            return res.status(500).send({message: 'Producto no encontrado, o ya eliminado'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar'});
                }
            }).populate('productos')
    }
}

module.exports = {
    saveCategoria,
    getCategoria,
    updateCategoria,
    removeCategoria,
    categoriadeafult,
    //productos
    setProducto,
    getProduct,
    updateProduct,
    removeProduct
    

}