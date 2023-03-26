import express  from "express"
import {startExam , submitExam} from '../controller/exam'
import { isAuthenticated } from "../middlewares/isAuth";

const examRouter = express.Router()

//get /exam /quizID
examRouter.get('/:quizId' ,isAuthenticated ,startExam)

//post /exam
examRouter.post('/' ,isAuthenticated ,submitExam)

export default examRouter