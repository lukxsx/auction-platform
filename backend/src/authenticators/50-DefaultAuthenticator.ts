import { AuthResult, Authenticator } from "../types.js";

export default class DefaultAuthenticator implements Authenticator {
    name = "Default authenticator";
    authenticate = async (
        username: string,
        password: string,
    ): Promise<AuthResult> => {
        const defaultUsers = [];

        // Admin user
        if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
            defaultUsers.push({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
                admin: true,
            });
        }

        // Demo user
        if (process.env.DEMO_MODE === "true") {
            defaultUsers.push({
                username: "demo",
                password: "demo",
                admin: false,
            });
        }

        // For tests
        if (process.env.NODE_ENV === "test") {
            defaultUsers.push(
                { username: "test_user", password: "pass1", admin: false },
                { username: "test_admin", password: "pass2", admin: true },
            );
        }

        for (let i = 0; i < defaultUsers.length; i++) {
            const user = defaultUsers[i];
            if (user.username === username && user.password === password)
                return Promise.resolve({ success: true, admin: user.admin });
        }

        return Promise.resolve({ success: false, admin: false });
    };
}
