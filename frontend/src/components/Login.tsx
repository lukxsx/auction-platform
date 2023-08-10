import React from "react";
import axios from "axios";
import { useState } from "react";
import loginService from "../services/login";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        try {
            const user = await loginService.login({ username, password });
            setUsername("");
            setPassword("");
            console.log(user);
            window.localStorage.setItem("appUser", JSON.stringify(user));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Failed login:", error.response?.data.error);
                console.error(error.response);
            } else {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsername(e.target.value)
                    }
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
