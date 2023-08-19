import { NewUser, User } from "../types";
import { db } from "../database";

const getUsers = async (): Promise<User[]> => {
    return await db.selectFrom("user").selectAll().orderBy("id").execute();
};

const getUserByName = async (username: string): Promise<User> => {
    try {
        const user = await db
            .selectFrom("user")
            .where("name", "=", username)
            .selectAll()
            .executeTakeFirstOrThrow();
        return user;
    } catch (error: unknown) {
        throw new Error("user not found");
    }
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
    getUserByName,
    createUser,
};
