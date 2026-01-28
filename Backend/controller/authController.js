import User from "../model/userModel.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { genToken, genToken1 } from "../config/token.js";

export const registration = async (req , res) =>{
    try{
        const {name , email , password} = req.body;
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message : "User already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message : "Enter valid email"})
        }
        if(password.length < 8){
            return res.status(400).json({message : "Enter strong password"})
        }
        let hashPassword = await bcrypt.hash(password,10)

        const user = await User.create({name , email , password : hashPassword})
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            secure : true,
            sameSite: "none",
            maxAge : 7 * 24 * 60 * 1000
        })
        return res.status(201).json(user)
    }
    catch(error){
        console.error("signUp Error");
        return res.status(500).json({message : `SignUp error ${error}`})
    }
}


export const login = async(req , res) =>{
    try{
        let {email , password} = req.body;
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message : "User not found"})
        }
        let isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
             return res.status(400).json({message : "Incorrect Password"})
        }
         let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly: true,
            secure : true,
            sameSite: "none",
            maxAge : 7 * 24 * 60 * 1000
        })
        return res.status(201).json(user)
        
    }
    catch(error){
        console.error("Login Error");
        return res.status(500).json({message : `Login error ${error}`})
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,        // or true in production HTTPS
      sameSite: "none",
      path: "/",            // IMPORTANT
    });

    return res.status(200).json({ message: "Log Out Successfully" });
  } catch (error) {
    console.error("LogOut Error");
    return res.status(500).json({ message: `LogOut error ${error}` });
  }
};


export const googleLogin = async (req, res) => {
  try {
    let { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = "google-auth-user";

      user = await User.create({
        name,
        email,
        password: randomPassword
      });
    }

    let token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({
      message: "Google Login error",
      error: error.message,
    });
  }
};


//...existing code...
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await genToken1(email);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // return JSON object (not raw string)
      return res.status(200).json({ token });
    }
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      message: "Admin Login error",
      error: error.message,
    });
  }
};
// ...existing code...
