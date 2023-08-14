import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { Item } from "../types";

const getAll = async (auctionId: number) => {
    const response = await axios.get<Item[]>(
        `${BACKEND_URL}/auctions/${auctionId}/items`,
        headers()
    );
    return response.data;
};

export default {
    getAll,
};
