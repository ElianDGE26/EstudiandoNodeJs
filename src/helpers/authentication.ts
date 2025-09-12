import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config/config";

// Puedes extender el tipo Request para guardar el payload decodificado
export interface AuthRequest extends Request {
    user?: {id: string; email: string;};
}

export const validetoken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const tokenValide = jwt.verify(token!, config.jwtSecret!);

       if (typeof tokenValide === 'string') {

            // Este caso sería raro si tú no firmas tokens con strings simples
            return res.status(401).json({ error: 'Invalid token format.' });
        }

        req.user = tokenValide as { email: string; id: string };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}


export const generateToken = (id: string, email: string):string => {
    return jwt.sign({ id, email },
                    config.jwtSecret!, 
                    { expiresIn: '1h' }
            );
}


// Middleware para que un usuario solo pueda acceder/modificar su propio recurso
export const isOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userIdFromParam = req.params.id;

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.id !== userIdFromParam) {
        return res.status(403).json({ message: 'Forbidden: You cannot access this resource' });
    }

    next();
};



                                                            