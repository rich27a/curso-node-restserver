const { request } = require('express');
const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
//const Role =  require('../models/role');



const usuariosGet = async(req = request, res = response) =>{

    //const {q, nombre = "No name", apikey, page =1, limit} = req.query;

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    

    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))

    ])

    res.json({
      total,
      usuarios
        //total,
        //usuarios
    });
  }

const usuariosPost = async(req, res = response) =>{

  

    const {nombre, correo, password, rol} = req.body; //estamos validando los campos a recibir
    const usuario = new Usuario({nombre, correo, password, rol});
    //const role = new Role({'rol':'Prueba_ROl'});

    //verificar si el correo existe
    // const existeEmail = await Usuario.findOne({correo});
    // if(existeEmail){
    //   return res.status(400).json({
    //     msg: 'El correo ya esta registrado'
    //   })
    // }

    //encriptar el password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //GuardarDB
    
    //await role.save();
    await usuario.save();
    

    res.json({
        msg: 'Post API - controlador',
        usuario
    });
  }

const usuariosDelete = async(req, res = response) =>{

    const {id} = req.params; //esta en los params www.example/params/params


    //fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    res.json({
      usuario
    });
  }

const usuariosPatch = (req, res = response) =>{

    

    res.json({
        msg: 'Patch API - controlador'
    });
  }

const usuariosPut = async (req, res = response) =>{

    const {id} = req.params;
    const {_id,password, google,correo, ...resto} = req.body;

    //TODO validar contra DB

    if(password){ 
      //encriptar el password
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
  }

  module.exports = {
      usuariosGet,
      usuariosPatch,
      usuariosPut,
      usuariosDelete,
      usuariosPost

  }