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

export interface Auction {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    active: boolean;
}

export interface RootState {
    auctions: Auction[];
}
