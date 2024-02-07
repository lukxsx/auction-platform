import { AuthResult, Authenticator } from "../types";

export default class DefaultAuthenticator implements Authenticator {
    name = "Default authenticator";
    authenticate = async (
        username: string,
        password: string
    ): Promise<AuthResult> => {
        // Used by tests
        if (process.env.NODE_ENV === "test") {
            if (username === "test_user" && password === "pass1") {
                return Promise.resolve({ success: true, admin: false });
            } else if (username === "test_admin" && password === "pass2") {
                return Promise.resolve({ success: true, admin: true });
            } else return Promise.resolve({ success: false, admin: false });
        }
        return username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
            ? Promise.resolve({ success: true, admin: true })
            : Promise.resolve({ success: false, admin: false });
    };
}
