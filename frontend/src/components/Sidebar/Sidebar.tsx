import { Nav, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AuctionState } from "../../types";
import "./Sidebar.css";
import { clearUser } from "../../reducers/user";

const Sidebar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const auctions = useSelector((state: RootState) => state.auctions);
    const currentAuctions = auctions.filter(
        (a) => a.state === AuctionState.Running
    );
    const upcomingAuctions = auctions.filter(
        (a) => a.state === AuctionState.Pending
    );
    const pastAuctions = auctions.filter(
        (a) => a.state === AuctionState.Finished
    );

    return (
        <Col sm={3} md={3} className="bg-light sidebar">
            <div className="sidebar-content">
                <div className="sidebar-section">
                    <h3>
                        <Link
                            to="/"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <strong>Auctions</strong>
                        </Link>
                    </h3>
                    <Nav className="flex-column">
                        {user && (
                            <>
                                <Nav.Item>Logged in as {user.name}</Nav.Item>
                                <Nav.Link onClick={() => dispatch(clearUser())}>
                                    Logout
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </div>
                <hr />

                <div className="sidebar-section">
                    <h4>Running auctions</h4>
                    <Nav className="flex-column">
                        {currentAuctions.map((a) => (
                            <Nav.Link
                                as={Link}
                                key={a.id}
                                to={`/auction/${a.id}`}
                            >
                                {a.name}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
                <hr />

                <div className="sidebar-section">
                    <h4>Upcoming auctions</h4>
                    <Nav className="flex-column">
                        {upcomingAuctions.map((a) => (
                            <Nav.Link
                                as={Link}
                                key={a.id}
                                to={`/auction/${a.id}`}
                            >
                                {a.name}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
                <hr />
                <div className="sidebar-section">
                    <h4>Past auctions</h4>
                    <Nav className="flex-column">
                        {pastAuctions.map((a) => (
                            <Nav.Link
                                as={Link}
                                key={a.id}
                                to={`/auction/${a.id}`}
                            >
                                {a.name}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>
            </div>
        </Col>
    );
};

export default Sidebar;
