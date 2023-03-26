import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import Quiz from "../model/quiz";
import ProjectError from "../Helper/error";

import returnResponse from "../utils/interfaces";


const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationError = validationResult(req);
    if(!validationError.isEmpty()){
        const err = new ProjectError("Validation Failed");
        err.statusCode = 422;
        err.data = validationError.array();
        throw err;
    }


    const created_by = req.userId;
    const name = req.body.name;
    const questions_list = req.body.questions_list;
    const answers = req.body.answers;

    const quiz = new Quiz({ name, questions_list, answers, created_by });
    const result = await quiz.save();
    const resp: returnResponse = {
      status: "success",
      massage: "Quiz created successfull",
      data: { quizId: result._id },
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};


const getQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questions_list: 1,
      created_by:1
    });

    if (!quiz) {
      const err = new ProjectError("Quiz not found");
      err.statusCode = 404;
      throw err;
    }
    if(req.userId  !== quiz.created_by.toString()){
        const err = new ProjectError("You are not authorised")
        err.statusCode = 403;
        throw err;
    }

        const resp = { status: "success", massage: "Quiz", data: quiz };
        res.status(200).send(resp);

  } catch (error) {
    next(error);
  }
};


const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const validationError = validationResult(req);
    if(!validationError.isEmpty()){
        const err = new ProjectError("Validation Failed");
        err.statusCode = 422;
        err.data = validationError.array();
        throw err;
    } 


    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      const err = new ProjectError("Quiz not found");
      err.statusCode = 404;
      throw err;
    }

    if(req.userId  !== quiz.created_by.toString()){
        const err = new ProjectError("You are not authorised")
        err.statusCode = 403;
        throw err;
    }

    if(quiz.is_publish){
        const err = new ProjectError("Action cannot performed , Quiz Published")
        err.statusCode = 405;
        throw err;
    }

    quiz.name = req.body.name;
    quiz.questions_list = req.body.questions_list;
    quiz.answers = req.body.answers;
    await quiz.save();
    const resp = { status: "success", massage: "Quiz Updated", data: {} };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};


const deleteQuiz = async (req: Request, res: Response , next:NextFunction) => {
  try{
    const quizId = req.params.quizId
    const quiz = await Quiz.findById(quizId)

    if(req.userId  !== quiz!.created_by.toString()){
        const err = new ProjectError("You are not authorised")
        err.statusCode = 403;
        throw err;
    }

    if(quiz!.is_publish){
        const err = new ProjectError("Action cannot performed , Quiz Published")
        err.statusCode = 405;
        throw err;
    }

    await quiz!.deleteOne({_id:quizId});
    const resp = { status: "success", massage: "Quiz Deleted", data: {} };
    res.status(200).send(resp);
  }catch(error){
    next(error)
  }
};


const publishQuiz = async (req: Request, res: Response , next:NextFunction) => {
  try{
    const quizId = req.body.quizId
    const quiz = await Quiz.findById(quizId);


    if(req.userId  !== quiz!.created_by.toString()){
        const err = new ProjectError("You are not authorised")
        err.statusCode = 403;
        throw err;
    }

    if(quiz!.is_publish){
        const err = new ProjectError("Action cannot performed , Quiz Published")
        err.statusCode = 405;
        throw err;
    }

    if (!quiz) {
        const err = new ProjectError("Quiz not found");
        err.statusCode = 404;
        throw err;
      }
    quiz.is_publish = true;
    await quiz.save()
    const resp = { status: "success", massage: "Quiz Published", data: {} };
    res.status(200).send(resp);
  }catch(error){
    next(error)
  }
};

export { createQuiz, getQuiz, updateQuiz, deleteQuiz, publishQuiz };
