import { Nav, Navbar, Container, Form, InputGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { RootState } from "../types";
import { clearUser } from "../reducers/user";
import { Button } from "react-bootstrap";
import { isAdmin } from "../utils/helpers";
import EditAuction from "./EditAuction";

const NavBar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = location.pathname;
    const user = useSelector((state: RootState) => state.user.user);
    const [showCreateAuctionForm, setShowCreateAuctionForm] = useState(false);

    return (
        <Navbar className="bg-body-tertiary mb-3">
            <EditAuction
                show={showCreateAuctionForm}
                close={() => setShowCreateAuctionForm(false)}
            />
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Auctions
                </Navbar.Brand>
                <Nav className="me-auto">
                    {currentPath === "/" && isAdmin() && (
                        <Button
                            size="sm"
                            onClick={() => setShowCreateAuctionForm(true)}
                        >
                            Add new auction
                        </Button>
                    )}
                    {currentPath.startsWith("/auction") && (
                        <Nav.Link as={Link} to="/">
                            Auction list
                        </Nav.Link>
                    )}
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
