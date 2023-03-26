import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ProjectError from "../Helper/error";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const err = new ProjectError("Not Autheticated");
        err.statusCode = 401;
        throw err;
    }
    const token = authHeader.split(" ")[1];

    let decodedToken: { userId: String; iat: Number; exp: Number };
    try {
      decodedToken = <any>jwt.verify(token, "myverysecretkey");
    } catch (error) {
        const err = new ProjectError("Not Autheticated");
        err.statusCode = 401;
        throw err;
    }

    if (!decodedToken) {
        const err = new ProjectError("Not Autheticated");
        err.statusCode = 401;
        throw err;
    }
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthenticated };
