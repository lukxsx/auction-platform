export const atoi = (input: string): number => {
    const parsedNumber = parseInt(input);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    }
    throw new Error("id is not a number");
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
