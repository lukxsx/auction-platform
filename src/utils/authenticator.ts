// hard-coded user accounts for testing
import { AuthResult } from "types";
const users = [
    { username: "localuser", password: "test" },
    { username: "test1", password: "password" },
    { username: "test2", password: "password" },
    { username: "test3", password: "password" },
];

export const authenticate = (
    username: string,
    password: string
): AuthResult => {
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return { success: true, admin: true };
    }
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    if (!user) {
        return { success: false, admin: false };
    }
    return { success: true, admin: false };
};
