import { DateState } from "../types.js";

// Check if current date is between start and end dates
export const checkDateWithState = (start: Date, end: Date): DateState => {
    const currentDate = new Date();
    if (currentDate > end) {
        // Too late
        return DateState.Late;
    } else if (currentDate < start) {
        // Too early
        return DateState.Early;
    } else {
        return DateState.Ok;
    }
};

// Check if current date is between start and end dates
export const checkDate = (start: Date, end: Date): boolean => {
    const currentDate = new Date();
    if (currentDate > end) {
        // Too late
        return false;
    } else if (currentDate < start) {
        // Too early
        return false;
    } else {
        return true;
    }
};

export const isOneMinuteLater = (date1: Date, date2: Date): boolean => {
    const timeDifference = Math.abs(date1.getTime() - date2.getTime());

    const timeDifferenceInMinutes = timeDifference / (1000 * 60);

    return timeDifferenceInMinutes <= 1;
};
