// // Importing required dependencies
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

import { Request, Response, NextFunction } from "express"; // Import Express types if using Express
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import { IUserDocument } from "../models/userModel"; // Import User model and define IUserDocument as needed

// Define the types for the request and response objects
interface AuthRequest extends Request {
  user?: IUserDocument; // Attach the user document to the request
  headers: {
    authorization?: string;
  };
}

// Defining the requireAuth middleware for protecting routes
const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Extracting the authorization header from the incoming request
  const { authorization } = req.headers;

  // If the authorization header is not present, return a 401 Unauthorized response
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // Extracting the JWT token from the authorization header
  const token = authorization.split(" ")[1];

  try {
    // Verifying the JWT token using the secret key and extracting the user ID
    const { _id } = jwt.verify(token, process.env.SECRET) as { _id: string };

    // Fetching the user from the database using the user ID and attaching it to the request object
    const user = await User.findOne({ _id }).select("_id");

    if (!user) {
      // Handle the case where the user is not found
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceeding to the next middleware or route handler
    next();
  } catch (error) {
    // Logging the error and returning a 401 Unauthorized response if token verification fails
    console.error(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

// Exporting the requireAuth middleware for use in other modules
module.exports = requireAuth;
