const express = require('express');
const connection = require("./config/db");
const {userRouter} = require("./routes/user.route")
require('dotenv').config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());


app.get('/' , (req,res) =>{
    res.send("HELLOWWW ☻")
});

app.use("/user", userRouter)

app.listen(PORT, async(req,res)=>{
    try {
        await connection
        console.log("SERVER RUNNING ☻ ♥ ☻");

    } catch (error) {
        console.log(error.message);
        console.log("Server Disconnected");

    }
    console.log("SERVER RUNNING");
})
