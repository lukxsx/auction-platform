import { User } from "./types";

declare module "express" {
    interface Request {
        token?: string;
        user?: User;
        admin?: boolean;
    }
}
