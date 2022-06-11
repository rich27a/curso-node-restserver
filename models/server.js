const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //conectar a DB
        this.conectarDB();


        //middlewares 
        this.middlewares();


        //rutas de mi app
        this.routes();
    }

    async conectarDB(){
        await dbConection();
    }

    middlewares(){
        //CORS 
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());



        //directorio publico
        this.app.use(express.static('public'));

    }

    routes(){
        
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;