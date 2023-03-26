
import mongoose from "mongoose";

//schema
const schema = mongoose.Schema;
const userSchema = new schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            index:true
        },
        password:{
            type:String,
            required:true
        }
    },
    {timestamps:true} // apne aap created at and updated at add kr dega 
);

//model 
const User = mongoose.model("User",userSchema)


export default User