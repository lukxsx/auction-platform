import express from "express";
import userService from "../services/users";
import itemService from "../services/items";
import { parseUserEntry } from "../utils/validate";
import { tokenExtractor, isAdmin, userExtractor } from "../middleware";

const router = express.Router();
router.use(tokenExtractor);

// List users, admin required
router.get("/", isAdmin, async (_req, res) => {
    res.json(await userService.getUsers());
});

// Add user, admin required
router.post("/", isAdmin, async (req, res) => {
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

// Wins by user
router.get("/:userId/wins", userExtractor, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        res.json(await itemService.getWonItemsByUser(userId));
    } catch (error: unknown) {
        let errorMessage = "Error getting user's wins";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});

export default router;
