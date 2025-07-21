import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return {
    accessToken,
  };
};

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const userExistis = await User.findOne({ email });

    if (userExistis) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { accessToken } = generateToken(user._id);

    res.status(201).json({
      name: user.name,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken } = generateToken(user._id);
      res.json({
        name: user.name,
        email: user.email,
        accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

