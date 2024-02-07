import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { isAdmin } from "../utils/helpers";
import AuctionMenu from "./Auction/AuctionMenu";
import EditAuction from "./Auction/AuctionForm";

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
                        id="new-auction-button"
                        size="sm"
                        className="mb-2"
                        onClick={() => setShowCreateAuctionForm(true)}
                    >
                        Add a new auction
                    </Button>
                )}
                <AuctionMenu />
            </Card.Body>
        </Card>
    );
};

export default Home;
