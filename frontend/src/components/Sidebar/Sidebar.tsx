import { Nav, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, AuctionState } from "../../types";
import "./Sidebar.css";

const Sidebar = () => {
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
                        <strong>Auctions</strong>
                    </h3>
                    <Nav className="flex-column">
                        <Nav.Link href="#home">Home</Nav.Link>
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
