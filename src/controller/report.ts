import { Request , Response , NextFunction } from "express";
import Report from "../model/report";
import ProjectError from "../Helper/error";

import returnResponse from "../utils/interfaces";


const getReport = async (req:Request , res:Response , next:NextFunction)=>{
    try{
        let report;
        if(!!req.params.reportId){

            const reportId = req.params.reportId
            report = await Report.findById(reportId)

            if(report!.userId.toString() !== req.userId){
                const err = new ProjectError("You are not allowed")
                err.statusCode = 405;
                throw err;
            }
        }else{
            report = await Report.find({userId:req.userId})
        }


        if(!report){
            const err = new ProjectError("Report not found")
            err.statusCode = 404
            throw err;
        }
        

        const resp: returnResponse = {
            status: "success",
            massage: "Report Found",
            data: report,
          };
          res.status(200).send(resp);

    }catch(error){
        next(error)
    }
}

export default getReport