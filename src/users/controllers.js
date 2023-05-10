const User = require("./model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
    res.status(201).json({
      message: "success",
      user: { username: req.body.username, token: token },
    });
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const login = async (req, res) => {
  try {
    //check for authenticated token route
    console.log("Authenticated user found");
    if (req.authCheck) {
      res.status(200).json({
        message: "Success",
        user: {
          id: req.authCheck.id,
          username: req.authCheck.username,
          token: req.header("Authorization").replace("Bearer ", ""),
        },
      });
      return;
    }
    //check the result of password match route
    if (!req.ourUser.passed) throw new Error("User data incorrect");
    console.log("user passed", req.url);

    let message = "";
    let statusCode = 0;
    //one last check to see if we have just registered a new user before generating appropriate response
    if (req.url === "/users/register") {
      message = "User registered and logged in";
      statusCode = 201;
    } else {
      message = "User logged in";
      statusCode = 200;
    }
    //generate a token for the persistance cookie
    const token = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY);
    //send response
    res.status(200).json({
      result: message,
      user: {
        id: req.user.id,
        username: req.user.username,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({
      where: {
        username: req.body.username,
      },
    });
    res.status(202).json({ message: "success", result });
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error: error });
  }
};

const getAllUsers = async (req, res) => { 
  try { 
    const users = await User.findAll({ 
      attributes: ['username'] 
    }); 
    res.status(201).json({ message: "success", users: users }); 
  } catch (error) { 
    res.status(501).json({ errorMessage: "Validation error", error }); 
  } 
};

module.exports = {
  registerUser,
  login,
  deleteUser,
  getAllUsers,
};
