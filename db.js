import mysql from 'mysql2'

export const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "telegbot",
    password: "root",
    //port: 3336,
    connectionLimit : 10
})
