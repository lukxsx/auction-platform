/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { NewBid } from "../types";

const addBid = async (bid: NewBid) => {
    const response = await axios.post<NewBid>(
        `${BACKEND_URL}/bids`,
        bid,
        headers()
    );
    return response.data;
};

export default {
    addBid,
};
