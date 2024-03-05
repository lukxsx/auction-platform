import { NewUser, User } from "../types.js";
import { db } from "../database.js";

const getUsers = async (): Promise<User[]> => {
    const users = await db
        .selectFrom("user")
        .selectAll()
        .orderBy("id")
        .execute();
    return users;
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

const getUserById = async (userId: number): Promise<User> => {
    try {
        const user = await db
            .selectFrom("user")
            .where("id", "=", userId)
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
    getUserById,
    createUser,
};
