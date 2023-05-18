const User = require("../users/model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const comparePass = async (req, res, next) => {
  try {
    req.ourUser = await User.findOne({
      where: { username: req.body.username },
    });

    if (!req.ourUser) {
      throw new Error("Credentials Incorrect");
    }

    req.ourUser.passed = await bcrypt.compare(
      req.body.password,
      req.ourUser.password
    );

    if (req.ourUser.passed) {
      req.user = {
        id: req.ourUser.id,
        username: req.ourUser.username,
        password: req.ourUser.password,
        locality: req.ourUser.locality
      };
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(501).json({ errorMessage: "User data incorrect", error: error });
  }
};

const hashPass = async (req, res, next) => {
  try {
    const saltRounds = process.env.SALT_ROUNDS;

    req.body.password = await bcrypt.hash(
      req.body.password,
      parseInt(saltRounds)
    );

    next();
  } catch (error) {
    console.error(error);
    res.status(501).json({ errorMessage: "hash fail", error: error });
  }
};

const tokenCheck = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      throw new Error("Missing Credentials");
    }
    const token = req.header("Authorization").replace("Bearer ", "");
    const newID = jwt.verify(token, process.env.SECRET_KEY);
    const newUser = await User.findOne({ where: { id: newID.id } });
console.log(newUser)
    if (!newUser) {
      res.status(401).json({ errorMessage: "User not authorized" });
      return;
    }

    req.authCheck = {
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      locality: newUser.locality, 
    };

    next();
  } catch (error) {
    console.error(error);

    res.status(501).json({ errorMessage: "token fail", error: error });
  }
};
module.exports = {
  comparePass,
  hashPass,
  tokenCheck,
};
