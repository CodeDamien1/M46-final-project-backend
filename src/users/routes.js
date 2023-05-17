const { Router } = require("express")

const userRouter = Router()

const {registerUser, login, deleteUser, getAllUsers, updateUser} = require("./controllers") 
const {hashPass, comparePass, tokenCheck } = require("../middleware")

userRouter.post("/users/register", hashPass, registerUser)

userRouter.post("/users/login", comparePass, login)

userRouter.get("/users/authcheck", tokenCheck, login)

userRouter.get("/users/getallusers", tokenCheck, getAllUsers)

userRouter.delete("/users/deleteuser", tokenCheck, deleteUser)

userRouter.put("/users/updateuser", tokenCheck, updateUser);





module.exports = userRouter