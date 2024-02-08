import express from "express";
import {
    createTestData,
    clearTestData,
    createBid,
    sendBid,
    endingSoonAuction,
} from "../utils/testdata";

//import userService from "../services/users";
//import bidService from "../services/bids";

const router = express.Router();

interface BidRequest {
    user_name: string;
    item_model: string;
    auction_name: string;
    price: number;
}

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

router.post("/createendingsoon", async (_req, res) => {
    try {
        await endingSoonAuction();
        res.status(200).send();
    } catch (error: unknown) {
        res.status(400).send({ error: "Error adding test data" });
    }
});

router.post("/createbid", async (req, res) => {
    try {
        const { user_name, item_model, auction_name, price }: BidRequest =
            req.body as BidRequest;
        console.log("Creating fake bid for");
        console.log(user_name, item_model, auction_name, price);
        await createBid(user_name, item_model, auction_name, price);
        res.status(200).send();
    } catch (error: unknown) {
        res.status(400).send({ error: "Error adding test data" });
    }
});

router.post("/sendbid", async (req, res) => {
    try {
        const { user_name, item_model, auction_name, price }: BidRequest =
            req.body as BidRequest;
        await sendBid(user_name, item_model, auction_name, price);
        res.status(200).send();
    } catch (error: unknown) {
        console.error(error);
        res.status(400).send({ error: "Error adding test data" });
    }
});

export default router;
