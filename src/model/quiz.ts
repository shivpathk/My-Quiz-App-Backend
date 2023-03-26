
import mongoose from "mongoose";

//schema
const schema = mongoose.Schema;
const quizSchema = new schema(
    {
        name:{
            type:String,
            required:true,
            unique : true
        },
        questions_list:[
            {
                question_number:{
                    type:Number
                },
                question:String,
                options:{}
            }
        ],
        answers:{},
        created_by:{
            type:mongoose.Types.ObjectId,
            required:true
        },
        is_publish:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true} // apne aap created at and updated at add kr dega 
);

//model 
const Quiz = mongoose.model("Quiz",quizSchema)


export default Quiz