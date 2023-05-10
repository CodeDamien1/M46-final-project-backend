const User = require("../users/model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const comparePass = async (req, res, next) => {
  try {
    //lookup user in database using username sent in request body
    req.ourUser = await User.findOne({
      where: { userName: req.body.username },
    });
    //if nothing returned, throw an error
    if (!req.ourUser) {
      throw new Error("Credentials Incorrect");
    }

    //use bcypt to compare the incomming password with the encrypted one stored in the database
    req.ourUser.passed = await bcrypt.compare(
      req.body.password,
      req.ourUser.password
    );
    //configure return object
    if (req.ourUser.passed) {
      req.user = {
        id:req.ourUser.id,
        username: req.ourUser.username,
        password: req.ourUser.password,
      };
    }
    //go to the next stage in the route
    next();
  } catch (error) {
    console.error(error);
    res.status(501).json({ message: "failure", error: error });
  }
};

const hashPass = async (req, res, next) => {
  try {    
    console.log("hash");
    //get number of salt rounds from .env file
    const saltRounds = process.env.SALT_ROUNDS;

    //get user password and pass to bcrypt to create the hash
    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(saltRounds)
    );
    //go to the next stage in the route
    next();
  } catch (error) {
    console.error(error);
    res.status(501).json({ message: "failure", error: error });
  }
};



const tokenCheck = async (req, res, next) => {
  try {    
    console.log("token check");
    //check for the authorization header
    if (!req.header("Authorization")) {
      throw new Error("Missing Credentials");
    }
    //extract the token from the request header

    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token", token);
    //decode the token
    const newID = jwt.verify(token, process.env.SECRET_KEY);
     //lookup user from decoded id
    const newUser = await User.findOne({ where: { id:newID.id } });
     //check if we found a user and return with response if not
    if (!newUser) {
      res.status(401).json({ messge: "User not authorised" });
      return;
    }
    //prepare successful response
    req.authCheck = {
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
    };

    //go to the next stage in the route
    next();
  } catch (error) {
    console.error(error)

    res.status(501).json({ message: "failure", error: error });
  }
};
module.exports = {
  comparePass,
  hashPass,
  tokenCheck,
};