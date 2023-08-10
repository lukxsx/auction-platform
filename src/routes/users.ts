import express from "express";
import userService from "../services/users";
import { parseUserEntry } from "../utils/validate";
import { tokenExtractor, isAdmin } from "../middleware";

const router = express.Router();
router.use(tokenExtractor);
router.use(isAdmin);

// List users, admin required
router.get("/", async (_req, res) => {
    res.json(await userService.getUsers());
});

// Add user, admin required
router.post("/", async (req, res) => {
    try {
        const newUser = parseUserEntry(req.body);
        const added = await userService.createUser(newUser);
        res.json(added);
    } catch (error: unknown) {
        let errorMessage = "Error adding user";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});

export default router;
