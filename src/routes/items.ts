import express from "express";
import itemService from "../services/items";
import { parseItemEntry } from "../utils/validate";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json(await itemService.getItems());
});

router.post("/", async (req, res) => {
    try {
        const newItem = parseItemEntry(req.body);
        const added = await itemService.createItem(newItem);
        res.json(added);
    } catch (error: unknown) {
        let errorMessage = "Error adding item";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
