import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ListGroup, Badge } from "react-bootstrap";
import { RootState, AuctionState } from "../types";
import { formatDate } from "../utils/helpers";

const AuctionMenu = () => {
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
        <div>
            {currentAuctions.length > 0 && (
                <div>
                    <h4>Running auctions</h4>
                    <ListGroup className="mb-3">
                        {currentAuctions.map((auction) => (
                            <ListGroup.Item
                                variant="success"
                                key={auction.id}
                                as={Link}
                                to={`/auction/${auction.id}`}
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div
                                        className="fw-bold"
                                        style={{
                                            textDecorationStyle: "unset",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {auction.name}
                                    </div>
                                    <Badge>
                                        Start:{" "}
                                        {formatDate(auction.start_date, false)}
                                    </Badge>
                                    {"  "}
                                    <Badge>
                                        End:{" "}
                                        {formatDate(auction.end_date, false)}
                                    </Badge>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}

            {upcomingAuctions.length > 0 && (
                <div>
                    <h4>Upcoming auctions</h4>
                    <ListGroup className="mb-3">
                        {upcomingAuctions.map((auction) => (
                            <ListGroup.Item
                                key={auction.id}
                                variant="secondary"
                                as={Link}
                                to={`/auction/${auction.id}`}
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div
                                        className="fw-bold"
                                        style={{
                                            textDecorationStyle: "unset",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {auction.name}
                                    </div>
                                    <Badge>
                                        Start:{" "}
                                        {formatDate(auction.start_date, false)}
                                    </Badge>
                                    {"  "}
                                    <Badge>
                                        End:{" "}
                                        {formatDate(auction.end_date, false)}
                                    </Badge>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}

            {pastAuctions.length > 0 && (
                <div>
                    <h4>Past auctions</h4>
                    <ListGroup className="mb-3">
                        {pastAuctions.map((auction) => (
                            <ListGroup.Item
                                key={auction.id}
                                variant="dark"
                                as={Link}
                                to={`/auction/${auction.id}`}
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div
                                        className="fw-bold"
                                        style={{
                                            textDecorationStyle: "unset",
                                            textDecoration: "none",
                                        }}
                                    >
                                        {auction.name}
                                    </div>
                                    <Badge>
                                        Start:{" "}
                                        {formatDate(auction.start_date, false)}
                                    </Badge>
                                    {"  "}
                                    <Badge>
                                        End:{" "}
                                        {formatDate(auction.end_date, false)}
                                    </Badge>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
};

export default AuctionMenu;
