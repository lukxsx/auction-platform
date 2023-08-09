export const atoi = (input: string): number => {
    const parsedNumber = parseInt(input);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    throw new Error("id is not a number");
};

// Check if current date is between start and end dates
export const checkDate = (start: Date, end: Date): boolean => {
    const currentDate = new Date();
    if (currentDate > end) {
        // Too late
        return false;
    } else if (currentDate < start) {
        // Too earle
        return false;
    } else {
        return true;
    }
};
