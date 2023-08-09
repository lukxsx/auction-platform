import express from "express";
import auctionService from "../services/auctions";
import { parseAuctionEntry } from "../utils/validate";
import itemRouter from "../routes/items";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json(await auctionService.getAuctions());
});

router.get("/:auctionId", (req, res) => {
    const auctionId = req.params.auctionId;
    // Implement your logic to fetch the auction by ID
    res.json({ message: `Fetching auction with ID ${auctionId}` });
});

router.use("/:auctionId/items", itemRouter);

router.post("/", async (req, res) => {
    try {
        const newAuction = parseAuctionEntry(req.body);
        const added = await auctionService.createAuction(newAuction);
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
