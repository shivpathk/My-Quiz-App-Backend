import { NextFunction, Request, Response } from "express";
import User from "../model/user";
import ProjectError from "../Helper/error";

import returnResponse from "../utils/interfaces";


let resp: returnResponse;

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body._id;
    if (userId != req.userId) {
      const err = new ProjectError("You are not Authorised!");
      err.statusCode = 401;
      throw err;
    }
    const user = await User.findById(userId);
    user!.name = req.body.name;
    await user!.save();
    resp = {
      status: "success",
      massage: `data Updated`,
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;

    // authorisation
    if (userId != req.userId) {
      const err = new ProjectError("You are not Authorised!");
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findById(userId, { name: 1, email: 1 });
    if (!user) {
      const err = new ProjectError("No Result found");
      err.statusCode = 401;
      throw err;
    } else {
      resp = {
        status: "success",
        massage: `User Found`,
        data: user,
      };
      res.status(200).send(resp);
    }
  } catch (error) {
    next(error);
  }
};





export { getUser, updateUser };
