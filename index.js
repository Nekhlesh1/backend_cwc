require('dotenv').config();
const express = require('express');
const app = express();
// const PORT = 8000;

app.get('/', (req,res)=> {
    res.send("Hi")
})

app.listen(process.env.PORT, () =>{
    console.log("Listening to port : ",process.env.PORT);
})

