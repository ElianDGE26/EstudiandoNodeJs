import { Schema , model, Document } from "mongoose";
import { User } from "../types/user";

interface UserDocument extends Omit<User, "id">, Document{}

const userSchema = new Schema<UserDocument>({
    name: { type: String, requerired:true, trim:true},
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    celular: { type: Number, required: true, trim: true }
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
});

export const UserModel = model<UserDocument>('User', userSchema);