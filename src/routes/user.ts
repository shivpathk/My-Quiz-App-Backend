import express from 'express';
import { getUser , updateUser } from '../controller/user';
import { isAuthenticated } from '../middlewares/isAuth';

const userRouter = express.Router();


// user must be authenticated and authorised
//GET /user/:userId -> ':' iske use hone se nodejs smjh jaega ki yha pe koi value aayegi 
userRouter.get('/:userId' ,isAuthenticated ,getUser)

// user must be authenticated and authorised
// PUT /user/:userId
userRouter.put('/' ,isAuthenticated ,updateUser)


export default userRouter