const { Router } = require("express")

const userRouter = Router()

const {registerUser, login} = require("./controllers") 
const {hashPass, comparePass, tokenCheck } = require("../middleware")

userRouter.post("/users/register", hashPass, registerUser)

userRouter.post("/users/login", comparePass, login)

userRouter.get("/users/authcheck", tokenCheck, login)



//TODO: add rest of routes for each controller

module.exports = userRouter