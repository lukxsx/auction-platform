import express from "express";
import auctionService from "../services/auctions";
import { parseAuctionEntry } from "../utils/validate";
import itemRouter from "../routes/items";
import { atoi } from "../utils/helpers";
import { isAdmin, tokenExtractor } from "../middleware";

const router = express.Router();
router.use(tokenExtractor);

// Get all auctions
router.get("/", async (_req, res) => {
    res.json(await auctionService.getAuctions());
});

// Get auction by id
router.get("/:auctionId", async (req, res) => {
    try {
        const auctionId = atoi(req.params.auctionId);
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

export default router;
