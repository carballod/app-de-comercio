import { User } from "../../interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
