import { AuctionState, InfoValue, Item, LoginUser, WinStatus } from "../types";

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

export const capitalize = (input: string): string => {
    if (input.length === 0) {
        return input;
    }
    return input[0].toUpperCase() + input.slice(1);
};

// Check if the user has bidded on the item and are they winning
export const myBidStatus = (user: LoginUser | null, item: Item): WinStatus => {
    if (!user) return WinStatus.NotBidded;
    if (item.winner_name) {
        if (item.winner_name === user.name) {
            return WinStatus.Winning;
        } else if (item.bids.find((i) => i.username === user.name)) {
            return WinStatus.Losing;
        }
    }

    return WinStatus.NotBidded;
};

export const winText = (
    winStatus: WinStatus,
    auctionState: AuctionState,
): string => {
    if (winStatus === WinStatus.Winning) {
        return auctionState === AuctionState.Finished
            ? "You won this item"
            : "You are about to win this item";
    } else {
        return auctionState === AuctionState.Finished
            ? "You lost this item"
            : "You are about to lose this item";
    }
};

export const isJson = (str: string): boolean => {
    try {
        JSON.parse(str);
    } catch (error) {
        return false;
    }
    return true;
};

export const parseInfoValues = (str: string): InfoValue[] => {
    try {
        const parsedJson: { [key: string]: string } = JSON.parse(str);

        // Convert it into the desired format (array of objects)
        return Object.keys(parsedJson).map((key) => ({
            key,
            value: parsedJson[key],
        }));
    } catch (error) {
        return [];
    }
};
