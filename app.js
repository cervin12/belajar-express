import express from "express";
import apiRouter from './routes/api.js'
import connection from "./Connection.js";
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use('/', apiRouter)
app.use((req,res)=>{
    res.status(404).json({message: 'Invalid request'})
})

connection()

app.listen(env.APP_PORT, ()=>{
    console.log(`listening on port ${env.APP_PORT}`);
})