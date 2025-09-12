import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../config/config";


// Configurar dot.env
dotenv.config();

const connectionDB = async(): Promise<void> => {
    try {
        const mongoURI = config.dbUri;

        if (!mongoURI) {
            throw new Error('MONGO_URI no está definida en las variables de entorno');
        }
        await mongoose.connect(mongoURI);
        console.log('Base de datos online conectada con éxito');
    } catch (error) {
        console.error( 'mongoDB conection error',error);
        //throw new Error('Error a la hora de iniciar la base de datos');
        process.exit(1); 
    }
};

export default connectionDB;