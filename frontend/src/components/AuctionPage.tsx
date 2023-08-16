import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { atoi, formatDate } from "../utils/helpers";
import ItemList from "./ItemList";
import { Container, ListGroup, Button } from "react-bootstrap";

const AuctionPage = () => {
    let { id } = useParams();
    const user = useSelector((state: RootState) => state.user.user);
    const auctionId = atoi(id as string);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );
    if (!auction) return <p>Loading...</p>;

    const startDate = new Date(auction.start_date);
    const endDate = new Date(auction.end_date);
    return (
        <Container>
            <ListGroup>
                <h1>{auction.name}</h1>
                <h4>
                    {formatDate(startDate, false)} —{" "}
                    {formatDate(endDate, false)}
                </h4>
            </ListGroup>
            {user && user.is_admin && (
                <div>
                    <Button>Edit auction</Button> <Button>Add items</Button>{" "}
                </div>
            )}
            <ItemList auctionId={auctionId} auctionState={auction.state} />
        </Container>
    );
};

export default AuctionPage;
