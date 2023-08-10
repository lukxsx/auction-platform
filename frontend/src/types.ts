export interface LoginEntry {
    username: string;
    password: string;
}

export interface TokenData {
    username: string;
    user_id: number;
    is_admin: boolean;
}

export interface UserFromAPI {
    id: number;
    name: string;
    token: string;
}
