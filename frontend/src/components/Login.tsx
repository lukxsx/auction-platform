import { useState, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { isAxiosError } from "axios";
import { useAlert } from "../contexts/AlertContext";
import { setUser } from "../reducers/user";
import loginService from "../services/login";
import Notification from "./NotificationToast";
import Alert from "./Alert";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setAlert } = useAlert();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            const user = await loginService.login({ username, password });
            setUsername("");
            setPassword("");
            dispatch(setUser(user));
            navigate("/");
        } catch (error) {
            if (isAxiosError(error)) {
                const errorMsg = error.response?.data.error as string;
                setAlert(errorMsg, "danger");
            } else {
                console.error(error);
            }
            setUsername("");
            setPassword("");
        }
    };

    return (
        <div>
            <Notification />
            <Container style={{ marginTop: "20vw", maxWidth: "500px" }}>
                <Card>
                    <Card.Header>Login</Card.Header>
                    <Card.Body>
                        <Alert />
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        id="username"
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
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                id="login-button"
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
