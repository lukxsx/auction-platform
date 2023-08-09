import express from "express";
import { parseBidEntry } from "../utils/validate";
import bidService from "../services/bids";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newBidEntry = parseBidEntry(req.body);
        const newBid = await bidService.bidOnItem(newBidEntry);
        res.json(newBid);
    } catch (error: unknown) {
        let errorMessage = "Error adding bid";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
