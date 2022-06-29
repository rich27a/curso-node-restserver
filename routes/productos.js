const { response } = require('express');
const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();


//obtener todas las categorias - publico
router.get('/',obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es id de mongo valido').isMongoId(),
    validarCampos
], obtenerProductoPorId);

//Crear producto - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo Valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

//Actualizar -privado -cualquier tokan valido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto);

//Borrar un producto - Admin 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);

module.exports = router;