import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface Database {
    user: UserTable;
    auction: AuctionTable;
    item: ItemTable;
    bid: BidTable;
}

interface UserTable {
    id: Generated<number>;
    name: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

interface ItemTable {
    id: Generated<number>;
    code?: string;
    model: string;
    make: string;
    info?: string;
    auction_id: number;
    starting_price: number;
    current_price: number;
    winner_id?: number;
    winner_name?: string;
    state: ItemState;
}

export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type NewItemFromAPI = Omit<NewItem, "auction_id">;
export type ItemUpdate = Updateable<ItemTable>;

interface BidTable {
    id: Generated<number>;
    price: number;
    username?: string;
    user_id: number;
    item_id: number;
    auction_id: number;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type Bid = Selectable<BidTable>;
export type NewBid = Insertable<BidTable>;
export type BidUpdate = Updateable<BidTable>;

interface AuctionTable {
    id: Generated<number>;
    name: string;
    start_date: Date;
    end_date: Date;
    state: AuctionState;
}

export type Auction = Selectable<AuctionTable>;
export type NewAuction = Insertable<AuctionTable>;
export type AuctionUpdate = Updateable<AuctionTable>;

export type ItemWithBids = Item & {
    bids: Bid[];
};

export interface LoginEntry {
    username: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    admin: boolean;
}

export interface TokenData {
    username: string;
    user_id: number;
    is_admin: boolean;
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

export enum DateState {
    Early = "early",
    Late = "late",
    Ok = "ok",
}

export enum UpdateType {
    AuctionFinished = "auctionfinished",
    AuctionStarted = "auctionstarted",
}

export interface SocketUpdate {
    updateType: UpdateType;
    value: Auction | Item;
}
