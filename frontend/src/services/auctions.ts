/* eslint-disable import/no-anonymous-default-export */

import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { Auction, NewAuction } from "../types";

const getAll = async () => {
    const response = await axios.get<Auction[]>(
        `${BACKEND_URL}/auctions`,
        headers(),
    );
    return response.data;
};

const createAuction = async (newAuction: NewAuction) => {
    const response = await axios.post<Auction>(
        `${BACKEND_URL}/auctions`,
        newAuction,
        headers(),
    );
    return response.data;
};

const updateAuction = async (auctionUpdate: Auction) => {
    const response = await axios.put<Auction>(
        `${BACKEND_URL}/auctions/${auctionUpdate.id}`,
        auctionUpdate,
        headers(),
    );
    return response.data;
};

const deleteAuction = async (auction: Auction) => {
    await axios.delete(`${BACKEND_URL}/auctions/${auction.id}`, headers());
};

export default {
    getAll,
    createAuction,
    updateAuction,
    deleteAuction,
};
