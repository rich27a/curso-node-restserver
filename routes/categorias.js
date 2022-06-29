
const {Router} = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {crearCategoria, obtenerCategoriaPorId, obtenerCategoria, actualizarCategoria, borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//obtener todas las categorias - publico
router.get('/', obtenerCategoria);

//obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es id de mongo valido').isMongoId(),
    validarCampos
], obtenerCategoriaPorId);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//Actualizar - privado - cualquiera con un token valido
router.put('/:id',[
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre','Nombre esta vacio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);


module.exports = router;