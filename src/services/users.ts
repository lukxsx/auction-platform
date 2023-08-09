import { db } from "../database";
import { NewUser, User } from "../types";

export const getUsers = async (): Promise<User[]> => {
    return await db.selectFrom("user").selectAll().execute();
};

export const createUser = async (user: NewUser) => {
    return await db
        .insertInto("user")
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
};
