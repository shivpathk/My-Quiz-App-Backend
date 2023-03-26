import {RequestHandler} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user";
import ProjectError from "../Helper/error";
import { validationResult } from "express-validator";
import returnResponse from "../utils/interfaces";


let resp: returnResponse;

const userRegister:RequestHandler = async (req,res,next) => {
  try {
    // validation
    const validationError = validationResult(req)
    if(!validationError.isEmpty()){
      const err = new ProjectError("Validation Failed")
      err.statusCode = 422;
      err.data = validationError.array();
      throw err;
    }
    const name = req.body.name;
    const email = req.body.email;
    let password = await bcrypt.hash(req.body.password, 12);

    const user = new User({ name, email, password });
    const result = await user.save();
    if (!result) {
      resp = {
        status: "error",
        massage: "No Result found",
        data: {},
      };
      res.status(500).send(resp);
    } else {
      resp = {
        status: "success",
        massage: `User Registration done. Welcome ${req.body.name}`,
        data: { userId: result._id },
      };
      res.status(200).send(resp);
    }
  } catch (error) {
    next(error);
  }
};

const userlogin:RequestHandler = async (req,res,next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // find user with email
    const user = await User.findOne({ email });

    // user not found
    if (!user) {
      const err = new ProjectError("No User Found");
      err.statusCode = 401;
      throw err;
    } else {
      // verify password using bcrypt
      const status = await bcrypt.compare(password, user!.password);

      // then decide
      if (status) {
        // jwt web token
        const token = jwt.sign({ userId: user._id }, "myverysecretkey", {
          expiresIn: "1h",
        });

        resp = {
          status: "success",
          massage: `Log in Successfull`,
          data: { token },
        };
        res.status(200).send(resp);
      } else {
        const err = new ProjectError("Credentials Mismatch");
        err.statusCode = 401;
        throw err;
      }
    }
  } catch (error) {
    next(error);
  }
};

const isUserExist = async (email:String)=>{

    const user = await User.findOne({ email });

    // user not found
    if (!user) {
      return false;
    }
    return true;
}

export { userRegister, userlogin , isUserExist };
