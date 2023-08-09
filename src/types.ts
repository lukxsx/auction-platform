import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
} from "kysely";

export interface Database {
    user: UserTable;
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
    starting_price: number;
}

export type Item = Selectable<ItemTable>;
export type NewItem = Insertable<ItemTable>;
export type ItemUpdate = Updateable<ItemTable>;

interface BidTable {
    id: Generated<number>;
    price: number;
    user_id: number;
    item_id: number;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type Bid = Selectable<BidTable>;
export type NewBid = Insertable<BidTable>;
export type BidUpdate = Updateable<BidTable>;
