import { pool } from "./user"

export const createfolder = async(foldername: string,  userid: number) =>{
    const query= 
    `
    INSERT INTO folders (name, user_id)
    VALUES ($1, $2)
    RETURNING *

    `
    const result = await pool.query(query, [foldername, userid]);
    return result.rows[0];

} 

export const getUserFolder = async(userid: number) =>{
    const query = 
    `
    SELECT * FROM folders
    WHERE user_id = $1
    `
    const result = await pool.query(query, [userid]);
    return result.rows;
}


export const addFilesToFolder = async(fileName: string, fileSize: number ,folderId: number, folderPath: string ,  ) => {
    const query =
    `
    INSERT INTO files (name, size, folder_id, path)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `
    const result = await pool.query(query, [fileName,fileSize, folderId, folderPath]);
    return result.rows[0];
}

export const getFilesInFolder = async(folderId: number,userId:Number) => {
    const query =
    `
    SELECT * FROM files
    WHERE folder_id = $1 
    `
    const result = await pool.query(query, [folderId]);
    return result.rows;
}