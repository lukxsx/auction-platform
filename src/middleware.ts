import { JwtPayload, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { isString } from "./utils/validate";
import userService from "./services/users";

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

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
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
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not set");
            throw new Error("internal server error");
        }
        if (!req.token) {
            throw new Error("token missing or invalid");
        }
        const decodedToken = verify(
            req.token,
            process.env.JWT_SECRET
        ) as JwtPayload;
        if (!decodedToken.username && !decodedToken.user_id) {
            throw new Error("token missing or invalid");
        }

        if (!isString(decodedToken.username)) {
            throw new Error("token missing or invalid");
        }
        // TODO: causes termination if user cannot be dound
        const user = await userService.getUserByName(decodedToken.username);

        if (!user) {
            throw new Error("token missing or invalid");
        }

        req.user = user;

        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message }).end();
            return;
        }
        res.status(401).json({ error: "unauthorized" }).end();
        return;
    }
};
