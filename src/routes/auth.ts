import express from "express";
import { sign } from "jsonwebtoken";
import { parseLoginEntry } from "../utils/validate";
import userService from "../services/users";
import { authenticate } from "../utils/authenticator";
import { TokenData, User } from "../types";

const router = express.Router();

const userExists = async (username: string) => {
    try {
        await userService.getUserByName(username);
    } catch (error: unknown) {
        return false;
    }
    return true;
};

router.post("/login", async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not set!");
            throw Error;
        }
        const { username, password } = parseLoginEntry(req.body);

        // Authenticate user
        const authResult = authenticate(username, password);
        if (authResult.success) {
            console.log("User", username, "logged in");
            let user: User = { name: "", id: 0 };
            // Does the user exist?
            if (!(await userExists(username))) {
                console.log("User", username, "doesn't exist, creating user");
                user = await userService.createUser({ name: username });
            }
            user = await userService.getUserByName(username);

            const tokenData: TokenData = {
                username,
                user_id: user.id,
                is_admin: authResult.admin,
            };

            const token = sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: 60 * 120,
            });

            res.json({ ...user, token, is_admin: authResult.admin });
        } else {
            console.log("Failed login by " + username);
            res.status(400).json({ error: "incorrect username or password" });
            return;
        }
    } catch (error: unknown) {
        let errorMessage = "Error logging in";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).json({ error: errorMessage });
    }
});

export default router;
