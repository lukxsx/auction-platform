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

export const formatDate = (date: Date): string => {
    const day: string = String(date.getDate()).padStart(2, "0");
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const year: number = date.getFullYear();
    const hours: string = String(date.getHours()).padStart(2, "0");
    const minutes: string = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};
