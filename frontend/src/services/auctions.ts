import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { Auction } from "../types";

const getAll = async () => {
    const response = await axios.get<Auction[]>(
        `${BACKEND_URL}/auctions`,
        headers()
    );
    return response.data;
};

export default {
    getAll,
};
