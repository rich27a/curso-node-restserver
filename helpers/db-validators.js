const Role = require('../models/role');
const Usuario = require('../models/usuario');


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

module.exports = {
    esRoleValido,
    correoExiste,
    existeUsuarioPorId
}

