
//imprtaciones 
import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { isValidObjectId } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { generateToken } from "../helpers/authentication";
const start = Date.now();

const userService = new UserService();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const users = await userService.getAllUsers();

        if (users.length == 0) {
            res.status(200).json({
                message: 'No users found',
                data: []
            });
            return;
        }

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving users', error    
        });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid or missing ID parameter" });
        return;
    }    
    try {
        const userById = await userService.getUserById(id);

        if (!userById) {
            res.status(404).json({
                message: `User with id ${id} not found`
            });
            return;
        }

        res.status(200).json(userById);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retreiving user', error
        });
    }
}

export const postUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, celular } = req.body;

    if (!name || !email || !password || !celular) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    } else if (!validator.isEmail(email)) {
        res.status(400).json({ message: "Ivalid email format" });
        return;
    } else if (await userService.getUserByEmail(email)) {
        res.status(400).json({ message: "Email already in use" });
        return;
    }else {
        try {
            const passwordEncriptada = await bcrypt.hash(password, 10);

            const newUser = await userService.createUser({name, email, password: passwordEncriptada, celular});
            const token = generateToken(newUser.id!, email);
            res.status(201).json({
                message: 'User created successfully',
                data: newUser, token
            });
        }
        catch (error) {
            res.status(400).json({ message: "Error creating movie", error });
        }
    }
}

export const putUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const body = req.body;

    if(!id || !isValidObjectId(id)){
        res.status(400).json({message: "Ivalid or missing Id parameter"});
        return;
    }
    try {
        const updateUser = await userService.updateUser(id, body);

        if(!updateUser){
            res.status(404).json({
                message: `User with id ${id} not found`
            });
            return;
        }

        res.status(200).json({
            message: 'User updated successfully',
            data: updateUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;

    if(!id || !isValidObjectId(id)){
        res.status(400).json({message: "Ivalid or missing Id parameter"});
        return;
    }   
    try {
        const deletedUser = await userService.deleteUser(id);
        if(!deletedUser){
            res.status(404).json({
                message: `User with id ${id} not found`
            });
            return;
        }
        res.status(200).json({
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    console.log("Tiempo total:", Date.now() - start, "ms");
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }else if (!validator.isEmail(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }else{
        try {
            const user  = await userService.authenticateUser(email, password);

            if (!user) {
                res.status(401).json({ message: "User not exit" });
                return;
            } else {

            const token = generateToken(user.id!, user.email);
                
                res.status(200).json({
                    message: "Login successful",
                    data: user, token       
                });
            }
        } catch (error) {
            res.status(500).json({ message: "Error during login", error });
        }
    }
    console.log("Tiempo total:", Date.now() - start, "ms");
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    // Implement logout logic if needed (e.g., token invalidation)
    res.status(200).json({ message: "Logout successful" });
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    // Implement token refresh logic if needed
    res.status(200).json({ message: "Token refreshed successfully" });
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: "Invalid or missing ID parameter" });
        return;
    }
    if (!oldPassword || !newPassword) {
        res.status(400).json({ message: "Old and new passwords are required" });
        return;
    }
    try {
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({ message: `User with id ${id} not found` });
            return;
        }
        if (user.password !== oldPassword) {
            res.status(401).json({ message: "Old password is incorrect" });
            return;
        }
        user.password = newPassword;
        const updatedUser = await userService.updateUser(id, user);
        res.status(200).json({
            message: "Password changed successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error });
    }
}