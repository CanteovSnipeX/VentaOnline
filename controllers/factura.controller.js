'use strict'

var Factura = require('../models/factura.model');
var Dato = require('../models/dato.model');
var Carrito = require('../models/carrito.model');
var Producto = require('../models/producto.model');


function addFactura(req,res){
    var datoId = req.dato.sub;

    Carrito.findOne({cliente: datoId},(err, carritoFind)=>{
        if(err){
            return res.status(500).send({message: "Error "});
        }else if(carritoFind){
            if(carritoFind.productos != ""){
                let cantidad = carritoFind.stock;
                let producto = carritoFind.products;
                let i = 0;
                let j = 0;
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            if(stockP<cantidad[i]){
                                i++;
                                return res.send({message: "Cantidad de carrito ahora no es válida"});
                            }else{
                                i++;
                            }
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                producto.forEach(element =>{
                    Producto.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            let stockT = stockP - cantidad[j];
                            j++;
                            Producto.findByIdAndUpdate(element,{stock:stockT},{new:true},(err,stockUpdated)=>{
                                if(err){
                                    res.status(500).send({message: "Error al actualizar stock"});
                                }else if(stockUpdated){
                                    console.log("El stock del producto se actualizó exitosamente");
                                }else{
                                    res.status(500).send({message: "No se actualizó"});
                                }
                            })
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                var factura = new Bill();
                factura.name = req.dato.name;
                factura.productos = producto;
                factura.save((err,carrtioSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error "});
                    }else if(carrtioSaved){
                        Dato.findByIdAndUpdate(datoId,{$push:{facturas:carrtioSaved._id}},{new:true},(err,datoUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error factura "});
                            }else if(datoUpdated){
                                Carrito.findOneAndRemove({cliente: datoId},(err,carritoRemoved)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al eliminar "});
                                    }else if(carritoRemoved){
                                        var cart = new Cart();
                                        carrito.cliente = req.user.sub;
                                        carrito.save((err,carrtioSaved)=>{
                                            if(err){
                                                return res.status(500).send({message: "Error al limpiar carrito"});
                                            }else if(carrtioSaved){
                                                return res.send({message: "Carrito listo para otra compra",carrtioSaved});
                                            }else{
                                                return res.status(404).send({message: "No se limpió el carrito"});
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: "Carrito no existente"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se conectó la factura con el usuario"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Factura no creada"});
                    }
                })
            }else{
                return res.status(403).send({message: "No tiene productos en su carrito"});
            }
        }else{
            return res.status(403).send({message: "No se encontró su carrito"});
        }
    })
}

function getFactura(req,res){
    var datoId = req.dato.sub;

    if(req.dato.role == "ROLE_ADMIN"){
        Factura.find({}).exec((err,factura)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener facturas"});
            }else if(factura){
                return res.send({message: "Todas las facturas: ",factura});
            }else{
                return res.status(403).send({message: "No hay facturas por mostrar"});
            }
        })
    }else{
        Dato.findOne({_id : datoId}).populate("facturas").exec((err, dato)=>{
            if(err){
                console.log(err);
                return res.status(500).send({message: "Error al obtener datos"});
            }else if(dato){
                var facturas = dato.factura;
                return res.send({message: "Facturas: ",facturas});
            }else{
                return res.status(403).send({message: "No hay registros"});
            }
        })
    }
}

function getProductosfactura(req,res){
    var facturaId = req.params.id;

    Factura.findById({_id:facturaId}).populate("productos").exec((err,facturaFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar factura"});
        }else if(facturaFind){
            var productos = facturaFind.productos;
            return res.send({message: "Los productos de la factura son: ",productos});
        }else{
            return res.status(403).send({message: "ID de factura inexistente"});
        }
    })
}

function getMasProductos(req,res){
    Factura.find({}).populate("productos").exec((err,factura)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos"});
        }else if(factura){
            let productos = [];
            factura.forEach(element => {
                if(productos.includes(element.productos)){
                    //No hace nada
                }else{
                    productos.push(element.productos);
                }
            });
            return res.send({message: "Los productos más vendidos: ",productos});
        }else{
            return res.status(403).send({message: "No hay productos por mostrar"});
        }
    })
}

module.exports = {
    addFactura,
    getFactura,
    getProductosfactura,
    getMasProductos
}