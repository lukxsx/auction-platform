import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, Container, Card } from "react-bootstrap";
import { setUser } from "../reducers/user";
import loginService from "../services/login";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        try {
            const user = await loginService.login({ username, password });
            setUsername("");
            setPassword("");
            console.log(user);
            dispatch(setUser(user));
            navigate("/");
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
        <Container className="login-container">
            <Card>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
    // return (
    //     <div>
    //         <h2>Login</h2>
    //         <form >
    //             <label htmlFor="username">Username:</label>
    //             <input
    //                 type="text"
    //                 id="username"
    //                 name="username"
    //                 value={username}
    //                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    //                     setUsername(e.target.value)
    //                 }
    //             />
    //             <label htmlFor="password">Password:</label>
    //             <input
    //                 type="password"
    //                 id="password"
    //                 name="password"
    //                 value={password}
    //                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    //                     setPassword(e.target.value)
    //                 }
    //             />
    //             <button type="submit">Login</button>
    //         </form>
    //     </div>
    // );
};

export default Login;
