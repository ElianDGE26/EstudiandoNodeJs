
import { Schema, model, Document } from "mongoose";
import { Movie } from "../types/movie"

interface MovieDocument extends Omit<Movie, "id">, Document{}

const movieSchema = new Schema<MovieDocument>({
    title: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 }                                                                                                                                                        
},
{
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            return ret;
        }
    }
}


);
export const MovieModel = model<MovieDocument>('Movie', movieSchema);