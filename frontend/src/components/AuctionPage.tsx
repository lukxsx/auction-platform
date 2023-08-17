import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, ListGroup, Button } from "react-bootstrap";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { formatDate } from "../utils/helpers";
import ItemList from "./ItemList";
import AddItem from "./AddItem";
import { isAdmin } from "../utils/helpers";
import EditAuction from "./EditAuction";

const AuctionPage = () => {
    let { id } = useParams();
    const auctionId = parseInt(id as string, 10);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );

    const [showItemAddForm, setShowItemAddForm] = useState(false);
    const [showEditAuctionForm, setShowEditAuctionForm] = useState(false);

    if (!auction) return <p>Loading...</p>;

    return (
        <Container>
            <AddItem
                show={showItemAddForm}
                close={() => setShowItemAddForm(false)}
                auctionId={auctionId}
            />
            <EditAuction
                show={showEditAuctionForm}
                close={() => setShowEditAuctionForm(false)}
                auction={auction}
            />
            <ListGroup>
                <h1>{auction.name}</h1>
                <h4>
                    {formatDate(auction.start_date, false)} —{" "}
                    {formatDate(auction.end_date, false)}
                </h4>
            </ListGroup>
            {isAdmin() && (
                <div className="mb-3">
                    <Button onClick={() => setShowEditAuctionForm(true)}>
                        Edit auction
                    </Button>{" "}
                    <Button onClick={() => setShowItemAddForm(true)}>
                        Add items
                    </Button>{" "}
                    <Button>Download report</Button>
                </div>
            )}

            <ItemList auctionId={auctionId} auctionState={auction.state} />
        </Container>
    );
};

export default AuctionPage;
