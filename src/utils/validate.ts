import { NewUser, NewItem, NewAuction } from "../types";

const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
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

export const parseItemEntry = (object: unknown): NewItem => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if (
        "model" in object &&
        "make" in object &&
        "starting_price" in object &&
        "current_price" in object &&
        "auction_id" in object
    ) {
        const newItemEntry: NewItem = {
            model: parseString(object.model),
            make: parseString(object.make),
            starting_price: parseNumber(object.starting_price),
            current_price: parseNumber(object.current_price),
            auction_id: parseNumber(object.auction_id),
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
