import { LoginUser } from "../types";

export const atoi = (input: string): number => {
    const parsedNumber = parseInt(input);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    throw new Error("id is not a number");
};

export const isAdmin = (): boolean => {
    const userFromStore = localStorage.getItem("user");
    if (userFromStore) {
        const user: LoginUser = JSON.parse(userFromStore);
        return user.is_admin;
    }
    return false;
};

export const headers = () => {
    const user = localStorage.getItem("user");
    if (user) {
        const userDetails = JSON.parse(user);
        return {
            headers: {
                Authorization: `Bearer ${userDetails["token"]}`,
            },
        };
    } else {
        return {};
    }
};

export const formatDate = (date: Date, showSeconds: boolean): string => {
    const day: string = String(date.getDate()).padStart(2, "0");
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const year: number = date.getFullYear();
    const hours: string = String(date.getHours()).padStart(2, "0");
    const minutes: string = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return showSeconds
        ? `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
        : `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const stateToStatus = (state: string): string => {
    switch (state) {
        case "open":
            return "Bidding in progress";
        case "unsold":
            return "Didn't sell";
        case "sold":
            return "Sold";
        default:
            return "";
    }
};
