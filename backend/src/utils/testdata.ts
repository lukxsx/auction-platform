import { AuctionState, ItemState } from "../types";
import auctionService from "../services/auctions";
import itemService from "../services/items";
import userService from "../services/users";
import bidService from "../services/bids";

let createdItems: number[] = [];
let createdUsers: number[] = [];

const createItems = async (auction_id: number) => {
    const i1 = await itemService.createItem({
        auction_id,
        starting_price: 1,
        code: "a1",
        make: "Test Company",
        model: "Product 1",
        state: ItemState.Open,
        current_price: 1,
    });
    const i2 = await itemService.createItem({
        auction_id,
        starting_price: 3,
        code: "a2",
        make: "Test Company",
        model: "Product 2",
        state: ItemState.Open,
        current_price: 3,
    });
    const i3 = await itemService.createItem({
        auction_id,
        starting_price: 3,
        make: "Example Company",
        model: "A500",
        state: ItemState.Open,
        current_price: 3,
    });
    createdItems = createdItems.concat([i1.id, i2.id, i3.id]);
};

const createUsers = async () => {
    const alreadyCreated = await userService.getUserByName("user1");
    if (alreadyCreated) {
        if (createdUsers.length === 0) {
            const u1 = await userService.getUserByName("test_user");
            const u2 = await userService.getUserByName("test_admin");
            const u4 = await userService.getUserByName("user2");
            createdUsers = createdUsers.concat([
                u1.id,
                u2.id,
                alreadyCreated.id,
                u4.id,
            ]);
        }
        return;
    }
    const u1 = await userService.createUser({ name: "test_user" });
    const u2 = await userService.createUser({ name: "test_admin" });
    const u3 = await userService.createUser({ name: "user1" });
    const u4 = await userService.createUser({ name: "user2" });
    createdUsers = createdUsers.concat([u1.id, u2.id, u3.id, u4.id]);
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
        state: AuctionState.Finished,
    });
    const upcoming = await auctionService.createAuction({
        name: "test3",
        start_date: tomorrow,
        end_date: future,
        state: AuctionState.Finished,
    });

    await createItems(current.id);
    await createItems(past.id);
    await createItems(upcoming.id);
};

const clearTestData = async () => {
    await auctionService.deleteAll();
    await itemService.deleteAll();
    await bidService.deleteAll();
    createdItems = [];
};

export { createTestData, createUsers, clearTestData };
