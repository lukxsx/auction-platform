import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Form,
    Button,
    InputGroup,
    Container,
    Card,
    Alert,
} from "react-bootstrap";
import { setUser } from "../reducers/user";
import loginService from "../services/login";
import Notification from "./Notification";

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
                const errorMsg = error.response?.data.error as string;
                setAlertMessage(
                    errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1)
                );
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
                console.error(error.response);
            } else {
                console.error(error);
            }
            setUsername("");
            setPassword("");
        }
    };

    const [alertMessage, setAlertMessage] = useState("");

    return (
        <div>
            <Notification />
            <Container
                className="login-container"
                style={{ marginTop: "20vw", maxWidth: "500px" }}
            >
                <Card>
                    <Card.Header>Login</Card.Header>
                    <Card.Body>
                        <Alert variant="danger" show={alertMessage.length > 0}>
                            {alertMessage}
                        </Alert>
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={
                                    username.trim() === "" ||
                                    password.trim() === ""
                                }
                            >
                                Login
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;
