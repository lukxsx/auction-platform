import { db } from "../database";
import { NewUser, User } from "../types";

const getUsers = async (): Promise<User[]> => {
    return await db.selectFrom("user").selectAll().execute();
};

const createUser = async (user: NewUser): Promise<User> => {
    return await db
        .insertInto("user")
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow();
};

export default {
    getUsers,
    createUser,
};
