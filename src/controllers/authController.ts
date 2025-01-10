import { Request, Response,NextFunction  } from 'express';
import { hashedPassword, verifyPassword, generateToken } from '../services/auth';
import { createUser, getUserByEmail } from '../models/user';

export const signup = async (req: Request, res: Response,next:NextFunction ): Promise<void> => {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
        res.status(400).json({ message: "Please fill all fields" });
        return
    }

    try {
        const hashedPwd = await hashedPassword(password);
        const user = await createUser(email, full_name, hashedPwd);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};

export const login = async (req: Request, res: Response ,next:NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please fill all fields" });
        return;
    }

    try {
        const user = await getUserByEmail(email);
        if (!user) {
           res.status(404).json({ message: "User not found" });
           return
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        const token = await generateToken(user.id);
        res.status(200).json({ message: "Login successful", token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};