export const atoi = (input: string): number => {
    const parsedNumber = parseInt(input);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    throw new Error("id is not a number");
};
