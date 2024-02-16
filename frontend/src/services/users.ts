import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { headers } from "../utils/helpers";
import { User } from "../types";

const getUsers = async () => {
    const response = await axios.get<User[]>(`${BACKEND_URL}/users`, headers());
    return response.data;
};

export default {
    getUsers,
};
