import express from "express";
import itemService from "../services/items";
import { parseItemEntry } from "../utils/validate";

type parentParam = { auctionId: number };
const router = express.Router({ mergeParams: true });

router.get("/", async (_req, res) => {
    res.json(await itemService.getItems());
});

router.get("/:itemId", (req, res) => {
    const { auctionId, itemId } = req.params as typeof req.params & parentParam;
    res.send("hello item " + itemId + " from auction " + auctionId);
});

router.post("/", async (req, res) => {
    const { auctionId } = req.params as typeof req.params & parentParam;
    try {
        const newItem = parseItemEntry(req.body);
        const added = await itemService.createItem({
            auction_id: auctionId,
            ...newItem,
        });
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
