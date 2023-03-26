
import mongoose from "mongoose";

const schema = mongoose.Schema;
const reportSchema = new schema(
    {
        userId:{
            type:mongoose.Types.ObjectId,
            required:true,
            unique : true
        },
        quizId:{
            type:mongoose.Types.ObjectId,
            required:true,
            
        },
        score:{
            type:Number,
            required:true
        },
        total:{
            type:Number,
            required:true
        }
    },
    {timestamps:true} // apne aap created at and updated at add kr dega 
);

//model 
const Report = mongoose.model("Report",reportSchema)


export default Report