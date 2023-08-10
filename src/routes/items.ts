import express from "express";
import itemService from "../services/items";
import { parseItemEntry } from "../utils/validate";
import { atoi } from "../utils/helpers";
import { tokenExtractor, isAdmin } from "../middleware";

type parentParam = { auctionId: number };
const router = express.Router({ mergeParams: true });
router.use(tokenExtractor);

// Get all items
router.get("/", async (req, res) => {
    const { auctionId } = req.params as typeof req.params & parentParam;
    if (!auctionId) {
        res.json(await itemService.getAllItems());
        return;
    }
    res.json(await itemService.getItemsByAuction(auctionId));
});

// Get item by id
router.get("/:itemId", async (req, res) => {
    try {
        const itemId = atoi(req.params.itemId);
        res.json(await itemService.getItemByIdWithBids(itemId));
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(400).json({ error: "not found" });
    }
});

// Add new item, requires admin
router.post("/", isAdmin, async (req, res) => {
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
        res.status(400).send({ error: errorMessage });
    }
});

export default router;
