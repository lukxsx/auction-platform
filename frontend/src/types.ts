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
    is_admin: boolean;
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
    bids: Bid[];
}

export type NewItem = Omit<Item, "id" | "bids" | "current_price" | "state">;

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

export type NewAuction = Omit<Auction, "id" | "state">;

export interface RootState {
    auctions: Auction[];
    items: Item[];
    user: {
        user: LoginUser | null;
    };
    notifications: Notification[];
    myBids: number[];
    favorites: number[];
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

export interface InfoValue {
    key: string;
    value: string;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    variant: string;
    show: boolean;
    link?: string;
}

export enum UpdateType {
    AuctionFinished = "auctionfinished",
    AuctionStarted = "auctionstarted",
}

export interface SocketUpdate {
    updateType: UpdateType;
    value: Auction | Item;
}

export interface AlertContent {
    message: string;
    variant: string;
}

// Using React Bootsrap's color definitions as the enum values
// to use these easily for changing colors
export enum WinStatus {
    Winning = "success",
    Losing = "danger",
    NotBidded = "",
}
