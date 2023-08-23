import { ListGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Auction } from "../../types";
import { formatDate } from "../../utils/helpers";

const AuctionListItem = ({
    auction,
    variant,
}: {
    auction: Auction;
    variant: string;
}) => {
    return (
        <ListGroup.Item
            variant={variant}
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
                <Badge>Start: {formatDate(auction.start_date, false)}</Badge>
                {"  "}
                <Badge>End: {formatDate(auction.end_date, false)}</Badge>
            </div>
        </ListGroup.Item>
    );
};

export default AuctionListItem;
