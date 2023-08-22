import { AuthResult, Authenticator } from "../types";

export default class AdminAuthenticator implements Authenticator {
    name = "Admin authenticator";
    authenticate = async (
        username: string,
        password: string
    ): Promise<AuthResult> => {
        return username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
            ? Promise.resolve({ success: true, admin: true })
            : Promise.resolve({ success: false, admin: false });
    };
}
