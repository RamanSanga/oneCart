import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    cartData : {
        type : Object,
        default : {}
    },
    discountUsed: {
        type: Boolean,
        default: false
    },
    wishlist: {
  type: [String], // store product IDs
  default: []
},
},
{
    timestamps : true,
    minimize : false
})

const User = mongoose.model("User" , userSchema)

export default User
