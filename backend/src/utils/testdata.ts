import { AuctionState, ItemState } from "../types";
import auctionService from "../services/auctions";
import itemService from "../services/items";

const createItems = async (auction_id: number) => {
    await itemService.createItem({
        auction_id,
        starting_price: 1,
        code: "a1",
        make: "Test Company",
        model: "Product 1",
        state: ItemState.Open,
        current_price: 1,
    });
    await itemService.createItem({
        auction_id,
        starting_price: 3,
        code: "a2",
        make: "Test Company",
        model: "Product 2",
        state: ItemState.Open,
        current_price: 3,
    });
    await itemService.createItem({
        auction_id,
        starting_price: 3,
        make: "Example Company",
        model: "A500",
        state: ItemState.Open,
        current_price: 3,
    });
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

    // Create auction
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

export { createTestData };
