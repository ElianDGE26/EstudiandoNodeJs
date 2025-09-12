import Server from "./server/server.js";
import * as dotenv from "dotenv";

// Configurar dot.env
dotenv.config();

const server = new Server();

server.listen();