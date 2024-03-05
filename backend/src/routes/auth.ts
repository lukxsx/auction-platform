import { AuthResult, Authenticator, TokenData, User } from "../types.js";
import express from "express";
import { loadAuthPlugins } from "../utils/authPluginLoader.js";
import { parseLoginEntry } from "../utils/validate.js";
import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;
import userService from "../services/users.js";

const router = express.Router();

// Load authenticator plugins
const authenticators: Authenticator[] = await loadAuthPlugins();

// Check if the user exists. Maybe move this to the userService??
const userExists = async (username: string) => {
    try {
        await userService.getUserByName(username);
    } catch (error: unknown) {
        return false;
    }
    return true;
};

// Try to authenticate with all available authenticator plugins
const tryAuthenticators = async (
    username: string,
    password: string,
): Promise<AuthResult> => {
    for (const authenticator of authenticators) {
        const authResult = await authenticator.authenticate(username, password);
        console.log(
            `Trying to authenticate user ${username} with ${authenticator.name}, result: ${authResult.success}`,
        );
        if (authResult.success) return authResult;
    }
    return { success: false, admin: false };
};

// Handle login request, generate JWT, add user to the users table if needed
router.post("/login", async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not set!");
            throw Error;
        }
        const { username, password } = parseLoginEntry(req.body);

        // Try all different authenticators
        const authResult = await tryAuthenticators(username, password);

        if (authResult.success) {
            console.log("User", username, "logged in");
            let user: User | null = null;
            // Does the user exist?
            if (!(await userExists(username))) {
                console.log("User", username, "doesn't exist, creating user");
                user = await userService.createUser({ name: username });
            }
            user = await userService.getUserByName(username);
            if (!user) throw new Error("User doesn't exist");

            const tokenData: TokenData = {
                username,
                user_id: user.id,
                is_admin: authResult.admin,
            };

            const token = sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: 7200, // 2 hours
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
