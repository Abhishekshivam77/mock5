const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { UserModel } = require("../models/user.model")
require('dotenv').config()


const UserRouter = express.Router()

UserRouter.post("/signup", async (req, res) => {

    try {

        const { name, email, password,confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json({ msg: 'Password and confirm password do not match' });
        }


        // checking if user present
        const UserExits = await UserModel.findOne({ email })

        if (UserExits) {
            return res.status(201).json({ msg: "User already Present" })
        }

        let  confirmhashedPassword = await bcrypt.hash(confirmpassword, 10);

        bcrypt.hash(password, 8, async (err, hash) => {

            if (err) {
                res.send({ "msg": "Something is Wrong", "err": err.message })
            } else {

                const user = new UserModel({ name, email, password: hash, confirmpassword:confirmhashedPassword })
                await user.save()
                res.send({ "msg": " New User Registered Success" })
            }
        })
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

UserRouter.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email })
        console.log(user)

        if (!user) {
            return res.status(401).json({ message: "No User found with this Email Signup Please" })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(201).json({ message: "Invalid username Or password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);


        res.status(200).json({ msg: "Login Successful", token: token });

    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})



module.exports = {UserRouter}