/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { Item, Bid, NewItem } from "../types";

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

const addItem = async (item: NewItem) => {
    const response = await axios.post<Item>(
        `${BACKEND_URL}/auctions/${item.auction_id}/items/`,
        item,
        headers()
    );
    return response.data;
};

const deleteItem = async (item: Item) => {
    await axios.delete(
        `${BACKEND_URL}/auctions/${item.auction_id}/items/${item.id}`,
        headers()
    );
};

const getWonItemsByUser = async (userId: number) => {
    const response = await axios.get<Item[]>(
        `${BACKEND_URL}/users/${userId}/wins`,
        headers()
    );
    return response.data;
};

export default {
    getAll,
    getBids,
    addItem,
    deleteItem,
    getWonItemsByUser,
};
