const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const Usuario = require('../models/usuario');

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {
       
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Si el usuario esta activo en la DB
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        //Verificar el password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

    

}

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);
        //console.log(googleUser);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el user esta desactivo en la DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT 
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo bien! Google sig-in',
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            msg: 'datos de google no verificados'
        })
    }

    

}

module.exports = {
    login,
    googleSignIn
}