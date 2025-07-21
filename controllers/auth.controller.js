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

const setCookies = (res, accessToken) => {
  res.cookie(
    "accessToken",
    accessToken,
    { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  );
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

    setCookies(res, accessToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
      setCookies(res, accessToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "No access token" });
    }
    res.clearCookie("accessToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
