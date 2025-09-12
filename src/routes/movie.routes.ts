

import { Router } from "express";
import { getMovies, getMovieById, postMovie, putMovie, deleteMovie } from "../controllers/movie.controller"; 

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', postMovie);
router.put('/:id', putMovie);
router.delete('/:id', deleteMovie);

export default router;