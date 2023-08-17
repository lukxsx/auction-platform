import express from "express";
import auctionService from "../services/auctions";
import { parseAuctionEntry } from "../utils/validate";
import itemRouter from "../routes/items";
import { isAdmin, tokenExtractor, userExtractor } from "../middleware";

const router = express.Router();
router.use(tokenExtractor);
router.use(userExtractor);

// Get all auctions
router.get("/", async (_req, res) => {
    res.json(await auctionService.getAuctions());
});

// Get auction by id
router.get("/:auctionId", async (req, res) => {
    try {
        const auctionId = parseInt(req.params.auctionId, 10);
        res.json(await auctionService.getAuctionById(auctionId));
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(400).json({ error: "not found" });
    }
});

router.use("/:auctionId/items", itemRouter);

// Add new auction
router.post("/", isAdmin, async (req, res) => {
    try {
        const newAuction = parseAuctionEntry(req.body);
        const added = await auctionService.createAuction(newAuction);
        res.json(added);
    } catch (error: unknown) {
        let errorMessage = "Error adding auction";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});

// Update auction
router.put("/:auctionId", isAdmin, async (req, res) => {
    try {
        const auctionId = parseInt(req.params.auctionId, 10);
        const auctionUpdate = parseAuctionEntry(req.body);
        if (!auctionUpdate.id) {
            throw new Error("invalid auction");
        }

        // Update auction
        await auctionService.updateAuction(auctionId, auctionUpdate);

        // Get updated auction
        const updated = await auctionService.getAuctionById(auctionUpdate.id);
        res.json(updated);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(400).json({ error: "not found" });
    }
});

export default router;
