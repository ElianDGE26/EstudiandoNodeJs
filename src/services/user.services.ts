import { User } from "../types/user";
import { UserModel } from "../models/user.models";
import bcrypt from "bcrypt";
const start = Date.now();

export class UserService {

    //retorna todos los usuarios
    async getAllUsers(): Promise<User[]> {
        return await UserModel.find();
    }

    //retorna un usuario por id
    async getUserById(id: string): Promise<User | null> {
        return await UserModel.findById(id);
    }

    //crea un nuevo usuario
    async createUser(userData: User): Promise<User> {
        const userCreated = new UserModel(userData);
        return await userCreated.save();
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true });
    }
    
    //elimina un usuario por id
    async deleteUser(id: string): Promise<User | null> {
        return await UserModel.findByIdAndDelete(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await UserModel.findOne({ email });
    }

    async authenticateUser(email: string, password: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null;

        return user.toJSON();
    }
}