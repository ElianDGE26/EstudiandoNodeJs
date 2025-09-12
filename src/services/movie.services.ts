import { Movie } from '../types/movie';
import { MovieModel } from '../models/movie.models';

export class MovieService {

    //retorna todasd las peliculas
    async getAllMovies(): Promise<Movie[]>{
        return await MovieModel.find();
    }

    //retorna una pelicula por id
    async getMovieByid(id:string): Promise<Movie | null> {
        return await MovieModel.findById(id);
    }

    //crea una nueva pelicula
    async createMovie(movieData: Movie): Promise<Movie> {
        const movieCreated = new MovieModel(movieData);
        return await movieCreated.save();
    }

    //actualiza una pelicula por id
    async updateMovie(id:string, movieData:Partial<Movie>): Promise<Movie | null> { 
        return await MovieModel.findByIdAndUpdate(id, movieData, { new: true });
    }

    //elimina una pelicula por id
    async deleteMovie(id:string): Promise<Movie | null> {
        return await MovieModel.findByIdAndDelete(id);
    }

}