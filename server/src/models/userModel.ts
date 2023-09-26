// // Importing required modules
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const validator = require("validator");

import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

// // Defining the schema for a User
// const Schema = mongoose.Schema;

// Creating a new schema for the User with several properties
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // The email should be unique for every user
  },
  username: {
    type: String,
    required: true,
    unique: true, // The username should be unique for every user
  },
  password: {
    type: String,
    required: true,
  },
  favorites: {
    type: [Schema.Types.ObjectId], // storing IDs of the favourite movies
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
  friendsRequests: {
    type: [Schema.Types.ObjectId],
  },
});

// Interface representing the User document
export interface IUserDocument extends Document {
  email: string;
  username: string;
  password: string;
  favorites: Schema.Types.ObjectId[];
  friends: Schema.Types.ObjectId[];
  friendsRequests: Schema.Types.ObjectId[];
}

// Static method to signup a new user
userSchema.statics.signup = async function (
  this: Model<IUserDocument>,
  email: string,
  username: string,
  password: string
): Promise<IUserDocument> {
  // Validation checks

  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }

  // Check if email already exists in the database
  const [exists] = await Promise.all([this.findOne({ email })]);

  if (exists) {
    throw Error("Email already in use");
  }

  // Encrypt the password before storing it
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create and return a new user
  return this.create({ email, username, password: hash });
};

// Static method to login a user
userSchema.statics.login = async function (
  this: Model<IUserDocument>,
  username: string,
  password: string
): Promise<IUserDocument> {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  // Check if the user with the provided username exists
  const [user] = await Promise.all([this.findOne({ username })]);

  if (!user) {
    throw Error("Incorrect email");
  }

  // Check if the provided password matches the stored password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// Method to add a movie to the user's favorites
userSchema.methods.addFavorite = async function (
  this: IUserDocument,
  movieId: Schema.Types.ObjectId
): Promise<IUserDocument> {
  if (this.favorites.includes(movieId)) {
    throw Error("Movie already in favorites");
  }
  this.favorites.push(movieId);
  return this.save();
};

// Method to remove a movie from the user's favorites
userSchema.methods.removeFavorite = async function (
  this: IUserDocument,
  movieId: Schema.Types.ObjectId
): Promise<IUserDocument> {
  const index = this.favorites.indexOf(movieId);
  if (index === -1) {
    throw Error("Movie not found in favorites");
  }
  this.favorites.splice(index, 1);
  return this.save();
};

// // Exporting the User model for use in other files
// module.exports = mongoose.modell("User", userSchema);

// Exporting the User model for use in other files
export const UserModel = mongoose.model<IUserDocument>("User", userSchema);
