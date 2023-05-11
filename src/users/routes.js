const { Router } = require("express")

const userRouter = Router()

const {registerUser, login, deleteUser, getAllUsers, updateUser} = require("./controllers") 
const {hashPass, comparePass, tokenCheck } = require("../middleware")

userRouter.post("/users/register", hashPass, registerUser)

userRouter.post("/users/login", comparePass, login)

userRouter.get("/users/authcheck", tokenCheck, login)

userRouter.get("/users/getallusers", tokenCheck, getAllUsers)

userRouter.delete("/users/deleteuser", deleteUser)

userRouter.put("/users/updateuser", updateUser);



//TODO: add rest of routes for each controller

module.exports = userRouter