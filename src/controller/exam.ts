import { Request, Response, NextFunction } from "express";
import ProjectError from "../Helper/error";
import Quiz from "../model/quiz";
import Report from "../model/report";

import returnResponse from "../utils/interfaces";


const startExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questions_list: 1,
      is_publish: 1,
    });
    if (!quiz) {
      const err = new ProjectError("No quiz found");
      err.statusCode = 404;
      throw err;
    }
    if (!quiz.is_publish) {
      const err = new ProjectError("Quiz is not published");
      err.statusCode = 405;
      throw err;
    }const resp: returnResponse = {
      status: "success",
      massage: "Exam Started",
      data:quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};
const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = req.body.quizId;
    const attempted_question = await req.body.attempted_question;

    const quiz = await Quiz.findById(quizId, { answers: 1 });
    const answers = quiz?.answers;
    const userId = req.userId;
    const allQuestions = Object.keys(answers);
    const total = allQuestions.length;

    let score = 0;

    for (let i = 0; i < total; i++) {
      let questions_number = allQuestions[i];
      if (
        !!attempted_question[questions_number] &&
        answers[questions_number] == attempted_question[questions_number]
      ) {
        score = score + 1;
      }
    }

    const report = new Report({userId , quizId , score , total});
    const data = await report.save()

    const resp: returnResponse = {
      status: "success",
      massage: "Quiz Submitted",
      data: { total, score , reportId:data._id},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

export { startExam, submitExam };
