// hard-coded user accounts for testing

const users = [{ username: "user", password: "test" }];

export const authenticate = (username: string, password: string): boolean => {
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    if (!user) {
        return false;
    }
    return true;
};
