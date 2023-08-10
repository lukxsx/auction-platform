import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import userService from "./services/users";
import { isString } from "./utils/validate";

export const tokenExtractor = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const auth = req.get("authorization");

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        req.token = auth.substring(7);
    }

    next();
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not set");
        res.status(500).json({ error: "internal server error" }).end();
        return;
    }
    if (!req.token) {
        res.status(401).json({ error: "token missing or invalid" }).end();
        return;
    }
    const decodedToken = verify(
        req.token,
        process.env.JWT_SECRET
    ) as JwtPayload;
    if (!decodedToken.username && !decodedToken.user_id) {
        res.status(401).json({ error: "token missing or invalid" }).end();
        return;
    }

    if (!isString(decodedToken.username)) {
        res.status(401).json({ error: "token missing or invalid" }).end();
        return;
    }

    if (decodedToken.is_admin) {
        req.admin = true;
    } else {
        res.status(401).json({ error: "unauthorized" }).end();
        return;
    }

    next();
};

export const userExtractor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not set");
        res.status(500).json({ error: "internal server error" }).end();
        return;
    }
    if (!req.token) {
        res.status(401).json({ error: "token missing or invalid" }).end();
        return;
    }
    const decodedToken = verify(
        req.token,
        process.env.JWT_SECRET
    ) as JwtPayload;
    if (!decodedToken.username && !decodedToken.user_id) {
        res.status(401).json({ error: "token missing or invalid" });
        return;
    }

    if (!isString(decodedToken.username)) {
        res.status(401).json({ error: "token missing or invalid" }).end();
        return;
    }
    // TODO: causes termination if user cannot be dound
    const user = await userService.getUserByName(decodedToken.username);

    if (!user) {
        res.status(401).json({ error: "cannot find user" }).end();
        return;
    }

    req.user = user;

    next();
};
