import express, { response } from "express";

const app = express();

app.use(express.json());

app.get('/',(request, response) => {
    console.log(request.body)
    response.send(`Hello ${request.query.name}, umur aku ${request.body.umur}`);
})

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})