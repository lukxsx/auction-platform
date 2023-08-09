import { NewUser } from "../types";

const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String;
};

const parseString = (str: unknown): string => {
    if (!isString(str)) {
        throw new Error("not a string");
    }
    return str;
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
