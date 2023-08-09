import express from "express";
import userService from "../services/users";
import { parseUserEntry } from "../utils/validate";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json(await userService.getUsers());
});

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
        res.status(400).send(errorMessage);
    }
});

export default router;
