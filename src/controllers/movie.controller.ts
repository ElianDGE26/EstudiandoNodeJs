
//importaciones
import { Request, Response } from "express";
import { MovieService } from "../services/movie.services";
import { isValidObjectId } from "mongoose";

const movieService = new MovieService();

//formato de todos los metodos
/*export const getEjemplo = async (req: Request, res: Response): Promise<void> => {
    try {
        
    } catch (error) {
        
    }
}
*/

export const getMovies = async (req: Request, res: Response): Promise<void> => {


    try {
        const movies = await movieService.getAllMovies();

        if (movies.length === 0) {
            res.status(200).json({
                message: 'No movies found',
                data: []
            });
            return;
        }
        res.status(200).json({
            message: 'Movies retrieved successfully',
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving movies', error
        });
    }
}

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

     // Validar que 'id' exista
    if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid or missing ID parameter" });
        return;
    }
    try {
        const movieByID = await movieService.getMovieByid(id);
        if (!movieByID) {
            res.status(404).json({
                message: `Movie with id ${id} not found`
            });
            return;
        }
        res.status(200).json(movieByID);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving moviesr", error  });
    }
}

export const postMovie = async (req: Request, res: Response): Promise<void> => {
    const body  = req.body;

    try {
        const newMovie = await movieService.createMovie(body);
        res.status(201).json({
            message: 'Movie created successfully',
            data: newMovie
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating movie", error });
    }
}

export const putMovie = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;

    // Validar que 'id' exista
    if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid or missing ID parameter" });
        return;
    }

    try {
        const updatedMovie = await movieService.updateMovie(id, body);

        if (!updatedMovie) {
            res.status(404).json({
                message: `Movie with id ${id} not found`
            });
            return;
        }

        res.status(200).json({
            message: 'Movie updated successfully',
            data: updatedMovie
        });

    } catch (error) {
         res.status(400).json({ message: "Error updating movie", error });
    }


}

export const deleteMovie = async (req: Request, res: Response):Promise<void> => {
    const id  = req.params.id;

    // Validar que 'id' exista
   if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid or missing ID parameter" });
        return;
    }
    
    try {
        await movieService.deleteMovie(id);
        res.status(204).json({  
            message: `Movie with id ${id} deleted successfully` 
        });
    } catch (error) {
        res.status(400).json({ message: "Error delete movie", error });
    }
}