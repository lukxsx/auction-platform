/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { Item, Bid } from "../types";

const getAll = async (auctionId: number) => {
    const response = await axios.get<Item[]>(
        `${BACKEND_URL}/auctions/${auctionId}/items`,
        headers()
    );
    return response.data;
};

const getBids = async (auctionId: number, itemId: number) => {
    const response = await axios.get<Bid[]>(
        `${BACKEND_URL}/auctions/${auctionId}/items/${itemId}/bids`,
        headers()
    );
    return response.data;
};

export default {
    getAll,
    getBids,
};
