import { jsonArrayFrom } from "kysely/helpers/postgres";
import { sql } from "kysely";
import { db } from "../database";
import { Item, NewItem, ItemUpdate, ItemWithBids } from "../types";

export const sqlItemsQuery = sql<Item[]>`SELECT
i.*,
COALESCE(hb.current_price, i.starting_price) AS current_price,
hb.winner
FROM
item AS i
LEFT JOIN (
SELECT
  b.item_id,
  b.price AS current_price,
  b.user_id AS winner
FROM
  bid AS b
WHERE
  (b.item_id, b.price) IN (
    SELECT
      item_id,
      MAX(price) AS max_price
    FROM
      bid
    GROUP BY
      item_id
  )
) AS hb ON i.id = hb.item_id;
`;

// SELECT
//   i.*,
//   COALESCE(hb.current_price, i.starting_price) AS current_price,
//   hb.winner
// FROM
//   item AS i
// LEFT JOIN (
//   SELECT
//     b.item_id,
//     b.price AS current_price,
//     b.user_id AS winner
//   FROM
//     bid AS b
//   WHERE
//     (b.item_id, b.price) IN (
//       SELECT
//         item_id,
//         MAX(price) AS max_price
//       FROM
//         bid
//       GROUP BY
//         item_id
//     )
// ) AS hb ON i.id = hb.item_id;

// Return all items in database
const getAllItems = async (): Promise<Item[]> => {
    return await db.selectFrom("item").selectAll().orderBy("id").execute();
};

// Return items included in a specific auction (bid data not included)
const getItemsByAuction = async (auctionId: number): Promise<Item[]> => {
    return await db
        .selectFrom("item")
        .where("auction_id", "=", auctionId)
        .selectAll()
        .orderBy("id")
        .execute();
};

// Get item by id
const getItemById = async (itemId: number): Promise<Item> => {
    try {
        const item = await db
            .selectFrom("item")
            .where("id", "=", itemId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return item;
    } catch (error: unknown) {
        throw new Error("item not found");
    }
};

// Get item by id, but also include bid data
const getItemByIdWithBids = async (itemId: number): Promise<ItemWithBids> => {
    try {
        const item = await db
            .selectFrom("item")
            .select((eb) => [
                "id",
                "model",
                "make",
                "info",
                "auction_id",
                "starting_price",
                "current_price",
                "winner_id",
                "winner_name",
                "state",
                jsonArrayFrom(
                    eb
                        .selectFrom("bid")
                        .selectAll()
                        .whereRef("bid.item_id", "=", "item.id")
                        .orderBy("bid.id")
                ).as("bids"),
            ])
            .where("id", "=", itemId)
            .executeTakeFirstOrThrow();
        return item;
    } catch (error: unknown) {
        throw new Error("item not found");
    }
};

// Update item with new values
const updateItem = async (itemId: number, updateWith: ItemUpdate) => {
    await db
        .updateTable("item")
        .set(updateWith)
        .where("id", "=", itemId)
        .executeTakeFirstOrThrow();
};

// Create new item
const createItem = async (item: NewItem): Promise<Item> => {
    return await db
        .insertInto("item")
        .values(item)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getAllItems,
    getItemById,
    getItemByIdWithBids,
    getItemsByAuction,
    updateItem,
    createItem,
};
