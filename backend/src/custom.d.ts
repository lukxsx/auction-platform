import { User } from "./types.js";

declare module "express" {
    interface Request {
        token?: string;
        user?: User;
        admin?: boolean;
    }
}
