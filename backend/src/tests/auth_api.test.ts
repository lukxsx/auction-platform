import { test, afterAll, expect } from "@jest/globals";
import supertest from "supertest";
import { httpServer, stopServer } from "../index.js";
import { LoginEntry } from "../types.js";

const api = supertest(httpServer);

test("User can login successfully", async () => {
    const loginAttempt: LoginEntry = {
        username: "test_user",
        password: "pass1",
    };
    const response = await api
        .post("/api/auth/login")
        .send(loginAttempt)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("is_admin");
});

test("Login with invalid credentials denied", async () => {
    const loginAttempt: LoginEntry = {
        username: "test_user",
        password: "pass3",
    };
    const response = await api
        .post("/api/auth/login")
        .send(loginAttempt)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveProperty(
        "error",
        "incorrect username or password",
    );
});

afterAll(() => {
    stopServer();
});
