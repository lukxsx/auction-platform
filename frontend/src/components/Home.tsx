import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { isAdmin } from "../utils/helpers";
import AuctionList from "./Auction/AuctionList";
import EditAuction from "./Auction/EditAuction";

const Home = () => {
    const [showCreateAuctionForm, setShowCreateAuctionForm] = useState(false);
    useEffect(() => {
        document.title = "Auctions";
    }, []);

    return (
        <Card>
            <EditAuction
                show={showCreateAuctionForm}
                close={() => setShowCreateAuctionForm(false)}
            />
            <Card.Header>Choose auction</Card.Header>
            <Card.Body>
                {isAdmin() && (
                    <Button
                        size="sm"
                        className="mb-2"
                        onClick={() => setShowCreateAuctionForm(true)}
                    >
                        Add a new auction
                    </Button>
                )}
                <AuctionList />
            </Card.Body>
        </Card>
    );
};

export default Home;
