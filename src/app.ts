import express , {Request,Response,NextFunction} from 'express';
import mongoose from 'mongoose';

import userRouter from './routes/user';
import authRouter from './routes/auth';
import ProjectError from './Helper/error';
import quizRouter from './routes/quiz';
import examRouter from './routes/exam';
import reportRouter from './routes/report';

const app = express();

interface returnResponse{
    status: "success" | "error",
    massage : String,
    data :{} | [];
}

const connection_string = process.env.CONNECTION_STRING || "";

mongoose.connect(connection_string);
mongoose.connection.on('connected',()=>{
    console.log("Database is connected")
})
mongoose.connection.on('error',(error)=>{
    console.log(error)
})

app.use(express.json())

declare global{
    namespace Express{
        interface Request{
            userId:String;
        }
    }
}

app.use('/user' , userRouter)
app.use('/auth' , authRouter)
app.use('/quiz' , quizRouter)
app.use('/exam' ,   examRouter)
app.use('/report' ,   reportRouter)

// error route
app.use((err:ProjectError , req:Request ,res:Response, next:NextFunction) =>{

    let massage:String;
    let statusCode:number;

    if(!!err.statusCode && err.statusCode < 500){
        massage = err.message
        statusCode = err.statusCode
    }else{
        massage = "Something went wrong please try after sometime";
        statusCode = 500;
    }
    let resp:returnResponse = {status:"error", massage,data:{}}
    if(!!err.data){
        resp.data = err.data;
    }
    console.log(err.statusCode , err.message)
    res.status(statusCode).send(resp)

})


app.listen(process.env.PORT , ()=>{
    console.log("Server Created")
})