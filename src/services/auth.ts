import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashedPassword = async( password: string): Promise<string>=> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const verifyPassword = async (password: string, hashedPassword: string):Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = async (userId:number) => {
    return jwt.sign({id: userId},process.env.JWT_SECRET as string, {expiresIn: '1h'});

}