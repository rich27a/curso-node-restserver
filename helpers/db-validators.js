const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const { response } = require('express');
const Producto = require('../models/producto');

// const esAdminRole = async(req, res = response) => {
//     if(req.usuario.rol !== 'ADMIN_ROLE'){
//         throw new Error(`El usuario ${req.usuario.nombre} no es administrador`);
//     }
// }

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol});

    if(!existeRol){
            throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }

}

const correoExiste = async(correo ='') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado en la DB`);
    }
}

const existeUsuarioPorId = async(id) => {

    //verificar si el usuario existe 
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id no existe ${id}`);
    }
}

const existeCategoriaPorId = async(id) => {
    
    //verificamos si la categoria existe
    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria){
        throw new Error(`La categoria con id ${id} no existe`);
    }

}

const existeProductoPorId = async(id) => {
    
    //verificamos si la categoria existe
    // const query = {id, estado: true}; //Los que tengan ese id y esten en true
    // const existeProducto = await Producto.findOne(query);
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El producto con id ${id} no existe`);
    }

}

//Validar colecciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = '') => {
    const incuida = colecciones.includes(coleccion);
    if(!incuida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }

    return true;
}

module.exports = {
    esRoleValido,
    correoExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}

