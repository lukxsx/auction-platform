import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { LoginEntry, UserFromAPI } from "../types";

const login = async (credentials: LoginEntry) => {
    const response = await axios.post<UserFromAPI>(
        `${BACKEND_URL}/auth/login`,
        credentials
    );
    return response.data;
};

export default { login };
