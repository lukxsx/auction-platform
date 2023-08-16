import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, ListGroup, Button } from "react-bootstrap";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { atoi, formatDate } from "../utils/helpers";
import ItemList from "./ItemList";
import AddItem from "./AddItem";
import { isAdmin } from "../utils/helpers";

const AuctionPage = () => {
    let { id } = useParams();
    const auctionId = atoi(id as string);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );

    const [showItemAddForm, setShowItemAddForm] = useState(false);

    if (!auction) return <p>Loading...</p>;

    const startDate = new Date(auction.start_date);
    const endDate = new Date(auction.end_date);
    return (
        <Container>
            <AddItem
                show={showItemAddForm}
                close={() => setShowItemAddForm(false)}
                auctionId={auctionId}
            />
            <ListGroup>
                <h1>{auction.name}</h1>
                <h4>
                    {formatDate(startDate, false)} —{" "}
                    {formatDate(endDate, false)}
                </h4>
            </ListGroup>
            {isAdmin() && (
                <div>
                    <Button>Edit auction</Button>{" "}
                    <Button onClick={() => setShowItemAddForm(true)}>
                        Add items
                    </Button>{" "}
                </div>
            )}
            <ItemList auctionId={auctionId} auctionState={auction.state} />
        </Container>
    );
};

export default AuctionPage;
