export interface LoginEntry {
    username: string;
    password: string;
}

export interface TokenData {
    username: string;
    user_id: number;
    is_admin: boolean;
}

export interface LoginUser {
    id: number;
    name: string;
    token: string;
}

export interface Item {
    id: number;
    model: string;
    make: string;
    info?: string;
    code?: string;
    auction_id: number;
    starting_price: number;
    current_price: number;
    winner_id?: number;
    winner_name?: string;
    state: ItemState;
}

export interface Bid {
    id: number;
    price: number;
    username?: string;
    user_id: number;
    item_id: number;
    auction_id: number;
    created_at: Date;
}

export type NewBid = Omit<Bid, "id" | "created_at">;

export interface Auction {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    state: AuctionState;
}

export interface AuctionItemsState {
    itemsByAuctionId: Record<number, Item[]>;
}

export interface RootState {
    auctions: Auction[];
    items: AuctionItemsState;
    user: {
        user: LoginUser | null;
    };
}

export enum AuctionState {
    Pending = "pending",
    Running = "running",
    Finished = "finished",
}

export enum ItemState {
    Open = "open",
    Sold = "sold",
    Unsold = "unsold",
}
