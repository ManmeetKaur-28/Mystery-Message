import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  messages: Message[];
  isAcceptingMessages: boolean;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username is a required field"],
  },
  email: {
    type: String,
    required: [true, "email is a required field"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "password is required field"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  messages: [messageSchema],
});
const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default User;
