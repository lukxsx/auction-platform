import express from "express";
import auctionService from "../services/auctions";
import { AuctionState, ItemState } from "../types";
import itemService from "../services/items";
//import userService from "../services/users";
//import bidService from "../services/bids";

const router = express.Router();

router.post("/resetauctions", async (_req, res) => {
    try {
        await auctionService.deleteAll();
        res.status(200).send();
    } catch (error: unknown) {
        res.status(400).send({ error: "Error deleting all auctions" });
    }
});

router.post("/createtestdata", async (_req, res) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const old = new Date(today);
    old.setDate(today.getDate() - 5);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const future = new Date(today);
    future.setDate(today.getDate() + 5);

    try {
        // Create auction
        const a1 = await auctionService.createAuction({
            name: "test1",
            start_date: today,
            end_date: tomorrow,
            state: AuctionState.Pending,
        });

        // Create item
        await itemService.createItem({
            auction_id: a1.id,
            starting_price: 1,
            make: "Apple",
            model: "iPhone 15",
            state: ItemState.Open,
            current_price: 1,
        });
        res.status(200).send();
    } catch (error: unknown) {
        res.status(400).send({ error: "Error adding test data" });
    }
});

export default router;
