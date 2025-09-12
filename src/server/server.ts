import express from "express";
import connectionDB from "../db/connectionDB";
import personaRoutes from "../routes/persona.routes";
import movieRoutes from "../routes/movie.routes"
import { errorHandler } from "../middlewares/error.handler";
import config from "../config/config";

class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = config.port || '8000';
        //Conectar a base de datos
        connectionDB();
        this.middlewares();
        this.routes();
        this.errrorMiddlewares();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto: " + config.port);
        });
    }

    middlewares() {// middlewares generales
        //parseo del body
        this.app.use(express.json());
        this.app.use(errorHandler);
    }

    routes() {
        this.app.use('/api/personas', personaRoutes);
        this.app.use('/api/movies', movieRoutes);
    }

    errrorMiddlewares() {// middlewares generales
        this.app.use(errorHandler);
    }

}

export default Server;