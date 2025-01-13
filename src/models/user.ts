import {Pool} from "pg"
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_USER);

export const pool= new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

})

export const createUser = async (email:string, fullname: string, password: string) => {
    const query = 
    `
    INSERT INTO users (email, full_name, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `
    const result =  await pool.query(query, [email, fullname, password])
    return result.rows[0];
}

export const getUserByEmail = async(email: string) => {
    const query = 
    `
    SELECT * FROM users
    WHERE email = $1
    `

    const result = await pool.query(query, [email])
    return result.rows[0];
}

