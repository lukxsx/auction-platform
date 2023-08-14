import axios from "axios";
import { BACKEND_URL } from "../utils/config";
import { LoginEntry, LoginUser } from "../types";

const login = async (credentials: LoginEntry) => {
    const response = await axios.post<LoginUser>(
        `${BACKEND_URL}/auth/login`,
        credentials
    );
    return response.data;
};

export default { login };
