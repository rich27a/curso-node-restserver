const { response } = require("express");
const { body } = require("express-validator");
const {Producto} = require("../models");

const obtenerProductos =  async(req, res = response) => {
    const {limite = 5, desde = 0} = req.params;

    const query = {estado: true}; //todos los que tengan estado true

    const [total, usuarios] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
          .populate("usuario","nombre")
          .populate("categoria","nombre")
      ]);

    res.json({
        total,
        usuarios
    })
}

const obtenerProductoPorId =  async(req, res = response) => {
   

    const {id} = req.params;
    //IMPORTANCIA DEL AWAIT EN LAS BUSQUEDAS, TENEMOS QUE ESPERAR
    const producto = await Producto.findById(id)
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre')  // Aqui mi error es que lo imprimi
                            // antes de que lo buscara por eso no salia nada

    if(!producto){
        return res.status(400).json({
            msg: `Error no existe producto con id ${id}`
        })
    }
    
    return res.status(200).json({
        producto
    })
}



const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body;
    
    
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya EXISTE`
        })
    }
    
    //Generar la data a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.json({
        producto
    })
}

//actualizar -privado -cualquiera con token valido
const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;

    const {estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
                                                        .populate("usuario","nombre")
                                                        .populate("categoria","nombre");

    res.status(200).json({
        producto
    })
}

//borrar -privado -solo admin - estado: false
const borrarProducto = async(req, res = response) => {

    const {id} = req.params;

    const datosActualizar = {
        usuario: req.usuario._id,
        estado: false
    }

    const producto = await Producto.findByIdAndUpdate(id,datosActualizar, {new: true})
                                                        .populate("usuario","nombre")
                                                        .populate("categoria","nombre");
    
    res.status(200).json({
        producto
    })


}



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto
}