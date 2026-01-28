// ...existing code...
import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    // accept either req.userId (user token) or req.userEmail (email token)
    if (!req.userId && !req.userEmail) {
      console.warn("getCurrentUser: missing req.userId and req.userEmail");
      return res.status(401).json({ message: "Unauthenticated" });
    }

    let user;
    if (req.userId) {
      user = await User.findById(req.userId).select("-password");
    } else {
      user = await User.findOne({ email: req.userEmail }).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return res.status(500).json({
      message: "Get current user failed",
      error: error.message,
    });
  }
};
// ...existing code...


export const getAdmin = async(req,res)=>{
  try{
    let adminEmail = req.adminEmail;
    if(!adminEmail){
      return res.status(404).json({message : "Admin is not found"});
    }
    return res.status(200).json({
      email : adminEmail,
      role : 'admin'
    })

  }
  catch(error){ 
    return res.status(500).json({
      message: "Get Admin error",
      error: error.message,
    });

  }
}
// ...existing code...