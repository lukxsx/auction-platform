import { test, describe, afterAll, beforeEach, expect } from "@jest/globals";
import supertest from "supertest";
import { httpServer, stopServer } from "../index";
import { Auction, LoginEntry } from "../types";

const api = supertest(httpServer);

let authToken: string;

const doLogin = async (username: string, password: string) => {
    const loginAttempt: LoginEntry = {
        username,
        password,
    };
    const response = await api
        .post("/api/auth/login")
        .send(loginAttempt)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    authToken = response.body.token;

    return response;
};

describe("Logged in as admin user", () => {
    beforeEach(async () => {
        await doLogin("test_admin", "pass2");
    });

    test("Admin can create new auction", async () => {
        const testDate = new Date();
        const newAuction = {
            name: "test auction",
            start_date: testDate,
            end_date: testDate,
        };

        const response = await api
            .post("/api/auctions")
            .set("Authorization", `Bearer ${authToken}`)
            .send(newAuction)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "test auction");
        expect(response.body).toHaveProperty(
            "start_date",
            testDate.toISOString()
        );
        expect(response.body).toHaveProperty(
            "end_date",
            testDate.toISOString()
        );
        expect(response.body).toHaveProperty("state", "pending");
    });

    test("Admin can edit auction", async () => {
        const testDate = new Date();
        const newAuction = {
            name: "test auction",
            start_date: testDate,
            end_date: testDate,
        };

        const response = await api
            .post("/api/auctions")
            .set("Authorization", `Bearer ${authToken}`)
            .send(newAuction)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const auctionId = response.body.id;

        const editedAuction = {
            name: "edited auction",
            start_date: testDate,
            end_date: testDate,
            id: auctionId,
            state: "pending",
        };

        const editResponse = await api
            .put(`/api/auctions/${auctionId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(editedAuction)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(editResponse.body).toHaveProperty("name", "edited auction");
    });

    test("Admin can delete auction", async () => {
        const testDate = new Date();
        const newAuction = {
            name: "auction to delete",
            start_date: testDate,
            end_date: testDate,
        };

        const response = await api
            .post("/api/auctions")
            .set("Authorization", `Bearer ${authToken}`)
            .send(newAuction)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        const auctionId = response.body.id;

        await api
            .delete(`/api/auctions/${auctionId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        const auctions = await api
            .get("/api/auctions")
            .set("Authorization", `Bearer ${authToken}`)
            .expect("Content-Type", /application\/json/)
            .expect(200);

        expect(Array.isArray(auctions.body)).toBe(true);
        if (!Array.isArray(response.body)) return;
        const containsDeleted = response.body.some(
            (item: Auction) => item.name === "auction to delete"
        );
        expect(containsDeleted).toBe(true);
    });
});

afterAll(() => {
    stopServer();
});
