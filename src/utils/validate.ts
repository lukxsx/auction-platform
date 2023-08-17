import {
    AuctionState,
    ItemState,
    NewUser,
    NewAuction,
    NewItemFromAPI,
    NewBid,
    LoginEntry,
} from "../types";

export const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

export const isNumber = (num: unknown): num is number => {
    return typeof num === "number" || num instanceof Number;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): Date => {
    if (!isString(date) || !isDate(date)) {
        throw new Error("not a date");
    }

    return new Date(date);
};

const parseString = (str: unknown): string => {
    if (!isString(str)) {
        throw new Error("not a string");
    }
    return str;
};

const parseNumber = (num: unknown): number => {
    if (!isNumber(num)) {
        throw new Error("not a number");
    }
    return num;
};

const isAuctionState = (param: string): param is AuctionState => {
    return Object.values(AuctionState)
        .map((v) => v.toString())
        .includes(param);
};

const parseAuctionState = (state: unknown): AuctionState => {
    if (!state || !isString(state) || !isAuctionState(state)) {
        throw new Error("Incorrect or missing auction state: " + state);
    }
    return state;
};

export const parseUserEntry = (object: unknown): NewUser => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("name" in object) {
        const newUserEntry: NewUser = {
            name: parseString(object.name),
        };

        return newUserEntry;
    }

    throw new Error("Incorrect data: missing property");
};

export const parseItemEntry = (object: unknown): NewItemFromAPI => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("model" in object && "make" in object && "starting_price" in object) {
        const newItemEntry: NewItemFromAPI = {
            model: parseString(object.model),
            make: parseString(object.make),
            info: "info" in object ? parseString(object.info) : "",
            code: "code" in object ? parseString(object.code) : "",
            starting_price: parseNumber(object.starting_price),
            current_price: parseNumber(object.starting_price),
            state: ItemState.Open,
        };

        // Check field lengths
        if (
            newItemEntry.model.trim().length > 256 ||
            newItemEntry.model.trim().length < 1
        ) {
            throw new Error(
                "Incorrect data: item model must be under 256 characters"
            );
        }
        if (
            newItemEntry.make.trim().length > 256 ||
            newItemEntry.make.trim().length < 1
        ) {
            throw new Error(
                "Incorrect data: item make must be under 256 characters"
            );
        }
        if (
            newItemEntry.info &&
            (newItemEntry.info.trim().length > 2048 ||
                newItemEntry.info.trim().length < 1)
        ) {
            throw new Error(
                "Incorrect data: item info must be under 2048 characters"
            );
        }
        if (
            newItemEntry.code &&
            (newItemEntry.code.trim().length > 64 ||
                newItemEntry.code.trim().length < 1)
        ) {
            throw new Error(
                "Incorrect data: item code must be under 64 characters"
            );
        }
        if (newItemEntry.starting_price < 0) {
            throw new Error(
                "Incorrect data: item starting price must be a positive integer"
            );
        }

        return newItemEntry;
    }

    throw new Error("Incorrect data: missing property");
};

export const parseAuctionEntry = (object: unknown): NewAuction => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("name" in object && "start_date" in object && "end_date" in object) {
        const newAuctionEntry: NewAuction = {
            name: parseString(object.name),
            start_date: parseDate(object.start_date),
            end_date: parseDate(object.end_date),
            state: AuctionState.Pending,
        };

        if ("id" in object && "state" in object) {
            newAuctionEntry.id = parseNumber(object.id);
            newAuctionEntry.state = parseAuctionState(object.state);
        }

        return newAuctionEntry;
    }

    throw new Error("Incorrect data: missing property");
};

export const parseBidEntry = (object: unknown): NewBid => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if (
        "price" in object &&
        "user_id" in object &&
        "item_id" in object &&
        "auction_id" in object
    ) {
        const newBidEntry: NewBid = {
            price: parseNumber(object.price),
            user_id: parseNumber(object.user_id),
            item_id: parseNumber(object.item_id),
            auction_id: parseNumber(object.auction_id),
        };

        return newBidEntry;
    }

    throw new Error("Incorrect data: missing property");
};

export const parseLoginEntry = (object: unknown): LoginEntry => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("username" in object && "password" in object) {
        const newLoginEntry: LoginEntry = {
            username: parseString(object.username),
            password: parseString(object.password),
        };

        return newLoginEntry;
    }

    throw new Error("Incorrect data: missing property");
};
