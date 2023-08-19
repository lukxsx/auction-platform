import { Nav, Navbar, Container, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { clearUser } from "../reducers/user";
import { Button } from "react-bootstrap";

const NavBar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    return (
        <Navbar className="bg-body-tertiary mb-3">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Auctions
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">
                        Auction list
                    </Nav.Link>
                    <Nav.Link as={Link} to="/">
                        Instructions
                    </Nav.Link>
                    <Nav.Link as={Link} to="/">
                        About
                    </Nav.Link>
                </Nav>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Form>
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1">
                                Logged in as {user && user.name}
                            </InputGroup.Text>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => dispatch(clearUser())}
                            >
                                Logout
                            </Button>
                        </InputGroup>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
