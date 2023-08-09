import {
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
            starting_price: parseNumber(object.starting_price),
            current_price: parseNumber(object.starting_price),
        };

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
        };

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
