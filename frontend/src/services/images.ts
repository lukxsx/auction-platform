/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { headers } from "../utils/helpers";
import { BACKEND_URL } from "../utils/config";

const uploadImage = async (itemId: number, formData: FormData) => {
    const response = await axios.post(
        `${BACKEND_URL}/images/${itemId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                ...headers().headers,
            },
        },
    );
    return response.data;
};

export default {
    uploadImage,
};
