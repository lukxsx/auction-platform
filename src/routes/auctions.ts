import express from "express";
import auctionService from "../services/auctions";
import { parseAuctionEntry } from "../utils/validate";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.json(await auctionService.getAuctions());
});

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
