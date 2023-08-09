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
    model: string;
    make: string;
    info?: string;
    auction_id: number;
    starting_price: number;
    current_price: number;
}

export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type NewItemFromAPI = Omit<NewItem, "auction_id">;
export type ItemUpdate = Updateable<ItemTable>;

interface BidTable {
    id: Generated<number>;
    price: number;
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
}

export type Auction = Selectable<AuctionTable>;
export type NewAuction = Insertable<AuctionTable>;
export type AuctionUpdate = Updateable<AuctionTable>;

export type ItemWithBids = Item & {
    bids: Bid[];
};
