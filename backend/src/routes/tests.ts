import express from "express";
import { createTestData, clearTestData } from "../utils/testdata";

//import userService from "../services/users";
//import bidService from "../services/bids";

const router = express.Router();

router.post("/resettestdata", async (_req, res) => {
    try {
        await clearTestData();
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
