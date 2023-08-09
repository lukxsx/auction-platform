import express, { Request } from "express";
import { parseBidEntry } from "../utils/validate";
import bidService from "../services/bids";
import { tokenExtractor, userExtractor } from "../middleware";

const router = express.Router();
router.use(tokenExtractor);
router.use(userExtractor);

router.post("/", async (req: Request, res) => {
    try {
        const newBidEntry = parseBidEntry(req.body);
        // Match user ID and bid's user_id
        if (!req.user) {
            throw Error("invalid user");
        }
        if (req.user.id !== newBidEntry.user_id) {
            throw Error("invalid user");
        }

        newBidEntry.username = req.user.name;
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
