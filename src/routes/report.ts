import express from 'express'
import getReport from '../controller/report'
import { isAuthenticated } from '../middlewares/isAuth';

const reportRouter = express.Router();

reportRouter.get('/:reportId?' ,isAuthenticated, getReport)

export default reportRouter