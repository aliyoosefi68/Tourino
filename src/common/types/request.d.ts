import { UserEntiy } from "src/modules/user/entity/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: UserEntiy;
    }
  }
}
