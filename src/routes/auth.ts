import express from 'express';
import {userRegister , userlogin , isUserExist} from '../controller/auth';
import { body } from 'express-validator';

const authRouter = express.Router();

//POST /auth/
authRouter.post('/' ,[
    body('name')
         .trim()
         .not()
         .isEmpty()
         .isLength({min:4})
         .withMessage("Please Enter a Valid name, Minimum 4 charater long"),
    body('email')
        .trim()
        .isEmail()
        .custom((emailId : string)=>{
            return isUserExist(emailId)
                .then((status:boolean)=>{
                    if(status){
                        return Promise.reject("User Already Exist!")
                    }
                })
                .catch((err)=>{
                    return Promise.reject(err)
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min:6})
        .withMessage("Enter password of atleast 6 character"),
    body('confirm password')
        .trim()
        .custom((value:string , {req})=>{
            if(value != req.body.password){
                return Promise.reject("Password not matched")
            }
            return true
        })
] ,userRegister)

//POST /auth/login
authRouter.post('/login' , userlogin)


export default authRouter