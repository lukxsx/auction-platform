import { ListGroup } from "react-bootstrap";
import { Auction } from "../../types";
import AuctionListItem from "./AuctionListItem";

const AuctionList = ({
    auctions,
    title,
    variant,
}: {
    auctions: Auction[];
    title: string;
    variant: string;
}) => {
    return (
        <div>
            {auctions.length > 0 && (
                <div>
                    <h4>{title}</h4>
                    <ListGroup className="mb-3">
                        {auctions.map((auction) => (
                            <AuctionListItem
                                key={auction.id}
                                auction={auction}
                                variant={variant}
                            />
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
};

export default AuctionList;
