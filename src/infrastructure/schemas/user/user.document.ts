import { Document } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
