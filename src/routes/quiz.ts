import express from "express";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
} from "../controller/quiz";
import { isAuthenticated } from "../middlewares/isAuth";
import { body } from "express-validator";

const quizRouter = express.Router();

// create
// post /quiz/
quizRouter.post(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Please Enter a Valid name, Minimum 4 charater long"),
    body("questions_list").custom((questions_list: []) => {
      if (questions_list.length == 0) {
        return Promise.reject("Enter atleast one question");
      }
      return true;
    })
  ],
  createQuiz
);

//get
//GET /quiz/:id
quizRouter.get("/:quizId", isAuthenticated, getQuiz);

//update
//put /quiz
quizRouter.put(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Please Enter a Valid name, Minimum 4 charater long"),
    body("questions_list").custom((questions_list: []) => {
      if (questions_list.length == 0) {
        return Promise.reject("Enter atleast one question");
      }
      return true;
    }),
    body("answers").custom((answers) => {
      if (Object.keys(answers).length == 0) {
        return Promise.reject("Answer should not be empty");
      }
    }),
  ],
  updateQuiz
);

//delete
//delete /quiz
quizRouter.delete("/:quizId", isAuthenticated, deleteQuiz);

//publish
//patch /quiz/quizId
quizRouter.patch("/publish", isAuthenticated, publishQuiz);

export default quizRouter;
