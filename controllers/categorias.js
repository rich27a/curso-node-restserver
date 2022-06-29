const { response } = require("express");
const { Categoria } =  require("../models")

//obtenerCategorias - paginado - total - populate ultimo usuario

const obtenerCategoria =  async(req, res = response) => {
    const {limite = 5, desde = 0} = req.params;

    const query = {estado: true}; //todos los que tengan estado en true

    const [total, usuarios] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
          .populate('usuario','nombre')
      ]);
    
      res.json({
        total,
        usuarios
          //total,
          //usuarios
      });

}

//obtenerCategoria - populate {}

const obtenerCategoriaPorId = async(req, res = response) => {

    const {id} = req.params;
    //IMPORTANCIA DEL AWAIT EN LAS BUSQUEDAS, TENEMOS QUE ESPERAR
    const categoria = await Categoria.findById(id).populate('usuario','nombre'); // Aqui mi error es que lo imprimi
    console.log(categoria)                          // antes de que lo buscara por eso no salia nada

    if(!categoria){
        return res.status(400).json({
            msg: `Error no existe producto con id ${id}`
        })
    }
    
    return res.status(200).json({
        categoria
    })

}



const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    console.log(categoriaDB);
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoris ${categoriaDB.nombre}, ya existe`
        })
    }

    //Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    const user = req.usuario;

    //Guardar DB
    await categoria.save();
    res.status(201).json({
        categoria,
        user
        
    });


}

//actualizarCategoria //Parivado cualquiera con token valido
const actualizarCategoria = async(req, res = response) => {
    const resto = {};
    const {id} = req.params;
    resto.usuario = req.usuario._id;
    resto.nombre = req.body.nombre.toUpperCase();
    
    console.log(resto);
    
    
    const categoria = await Categoria.findByIdAndUpdate(id,resto).populate('usuario','nombre');

    res.json({
        categoria
    })


}

//borrarCategoria - estado:false
const borrarCategoria = async(req,res = response) => {

    const datosActualizar = {};
    const {id} = req.params;

    datosActualizar.usuario = req.usuario._id;
    datosActualizar.estado = false;

    const categoria = await Categoria.findByIdAndUpdate(id,datosActualizar).populate('usuario','nombre');

    res.json({
        categoria
    })

}



module.exports = {
    crearCategoria,
    obtenerCategoriaPorId,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}