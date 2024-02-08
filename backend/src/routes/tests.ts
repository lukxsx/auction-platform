import express from "express";
import auctionService from "../services/auctions";
import { createTestData } from "../utils/testdata";

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
    try {
        await createTestData();
        res.status(200).send();
    } catch (error: unknown) {
        res.status(400).send({ error: "Error adding test data" });
    }
});

export default router;
