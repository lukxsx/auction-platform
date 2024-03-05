import {
    AuctionState,
    ItemState,
    Item,
    User,
    Auction,
    Bid,
    NewBid,
} from "../types.js";
import auctionService from "../services/auctions.js";
import itemService from "../services/items.js";
import userService from "../services/users.js";
import bidService from "../services/bids.js";

let createdItems: Item[] = [];
let createdUsers: User[] = [];
let createdAuctions: Auction[] = [];
let createdBids: Bid[] = [];

const createItems = async (auction_id: number, state: ItemState) => {
    const i1 = await itemService.createItem({
        auction_id,
        starting_price: 1,
        code: "a1",
        make: "Test Company",
        model: "Product 1",
        state,
        current_price: 1,
    });
    const i2 = await itemService.createItem({
        auction_id,
        starting_price: 3,
        code: "a2",
        make: "Test Company",
        model: "Product 2",
        state,
        current_price: 3,
    });
    const i3 = await itemService.createItem({
        auction_id,
        starting_price: 3,
        make: "Example Company",
        model: "A500",
        state,
        current_price: 3,
    });
    createdItems = createdItems.concat([i1, i2, i3]);
};

const createUsers = async () => {
    let alreadyCreated;

    try {
        alreadyCreated = await userService.getUserByName("user1");
    } catch (error: unknown) {
        /**/
    }
    if (alreadyCreated) {
        if (createdUsers.length === 0) {
            const u1 = await userService.getUserByName("test_user");
            const u2 = await userService.getUserByName("test_admin");
            const u4 = await userService.getUserByName("user2");
            createdUsers = createdUsers.concat([u1, u2, alreadyCreated, u4]);
        }
        return;
    }
    const u1 = await userService.createUser({ name: "test_user" });
    const u2 = await userService.createUser({ name: "test_admin" });
    const u3 = await userService.createUser({ name: "user1" });
    const u4 = await userService.createUser({ name: "user2" });
    createdUsers = createdUsers.concat([u1, u2, u3, u4]);
};

const createTestData = async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const old = new Date(today);
    old.setDate(today.getDate() - 5);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const future = new Date(today);
    future.setDate(today.getDate() + 5);

    const current = await auctionService.createAuction({
        name: "test1",
        start_date: today,
        end_date: tomorrow,
        state: AuctionState.Pending,
    });
    const past = await auctionService.createAuction({
        name: "test2",
        start_date: old,
        end_date: yesterday,
        state: AuctionState.Pending,
    });
    const upcoming = await auctionService.createAuction({
        name: "test3",
        start_date: tomorrow,
        end_date: future,
        state: AuctionState.Pending,
    });

    createdAuctions = createdAuctions.concat([current, past, upcoming]);

    await createItems(current.id, ItemState.Open);
    await createItems(past.id, ItemState.Unsold);
    await createItems(upcoming.id, ItemState.Open);
};

const endingSoonAuction = async () => {
    await createUsers();
    const now = new Date();
    const oneMinute = new Date(now.getTime() + 60000);
    const auction = await auctionService.createAuction({
        name: "Ending Soon",
        start_date: now,
        end_date: oneMinute,
        state: AuctionState.Pending,
    });

    await createItems(auction.id, ItemState.Open);
    createdAuctions = createdAuctions.concat(auction);
};

const createBid = async (
    user_name: string,
    item_model: string,
    auction_name: string,
    price: number,
) => {
    const user = createdUsers.find((u) => u.name === user_name);
    const item = createdItems.find((i) => i.model === item_model);
    const auction = createdAuctions.find((a) => a.name === auction_name);
    if (!user || !item || !auction) return;

    const bid = await bidService.createBid({
        auction_id: auction.id,
        item_id: item.id,
        price,
        user_id: user.id,
    });

    item.current_price = bid.price;
    item.winner_id = bid.user_id;
    item.winner_name = bid.username;
    await itemService.updateItem(item.id, item);

    createdBids = createdBids.concat(bid);
};

const sendBid = async (
    user_name: string,
    item_model: string,
    auction_name: string,
    price: number,
) => {
    const user = createdUsers.find((u) => u.name === user_name);
    const item = createdItems.find((i) => i.model === item_model);
    const auction = createdAuctions.find((a) => a.name === auction_name);
    if (!user || !item || !auction) return;
    const bid: NewBid = {
        auction_id: auction.id,
        item_id: item.id,
        user_id: user.id,
        price,
        username: user.name,
    };

    const newbid = await bidService.bidOnItem(bid);
    createdBids = createdBids.concat(newbid);
};

const clearTestData = async () => {
    await auctionService.deleteAll();
    await itemService.deleteAll();
    await bidService.deleteAll();
    createdItems = [];
    createdAuctions = [];
    createdBids = [];
};

export {
    createTestData,
    createUsers,
    clearTestData,
    createBid,
    sendBid,
    endingSoonAuction,
};
