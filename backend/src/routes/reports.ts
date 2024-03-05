import { isAdmin, tokenExtractor, userExtractor } from "../middleware.js";
import express from "express";
import auctionService from "../services/auctions.js";
import itemService from "../services/items.js";

const router = express.Router();
router.use(tokenExtractor);
router.use(userExtractor);

router.get("/:auctionId", isAdmin, async (req, res) => {
    try {
        const auctionId = parseInt(req.params.auctionId, 10);
        const auction = await auctionService.getAuctionById(auctionId);
        const items = await itemService.getSoldItems(auctionId);
        const userCosts = await itemService.getUserTotalCost(auctionId);
        const costsByUsers = userCosts.rows;

        // Render the 'table.ejs' template and pass the data to it
        res.render("report", { auction, items, costsByUsers });
    } catch (error) {
        let errorMessage = "Error getting report";
        if (error instanceof Error) {
            errorMessage += ": " + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});

export default router;
