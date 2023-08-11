import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { Auction } from "../types";

const getAll = async () => {
    const response = await axios.get<Auction[]>(`${BACKEND_URL}/auctions`);
    return response.data;
};

export default {
    getAll,
};
