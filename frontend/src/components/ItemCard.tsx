import { useSelector } from "react-redux";
import { Card, ListGroup, Button } from "react-bootstrap";
import { Item, ItemState, RootState, AuctionState } from "../types";
import { stateToStatus, myBidStatus } from "../utils/helpers";
import InfoText from "./InfoText";

const ItemCard = ({
    item,
    handleShowItem,
    auctionState,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
}) => {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        <Card border={myBidStatus(user, item)}>
            <Card.Body>
                <Card.Title>{item.model}</Card.Title>
                <Card.Subtitle>{item.make}</Card.Subtitle>
                <hr />
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        <strong>Starting price:</strong> {item.starting_price} €
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Current price:</strong> {item.current_price} €
                    </ListGroup.Item>
                    {item.info && (
                        <InfoText addPrefix={true} info={item.info} />
                    )}
                    {item.state !== ItemState.Open && (
                        <ListGroup.Item>
                            <strong>Status:</strong> {stateToStatus(item.state)}
                        </ListGroup.Item>
                    )}
                    {/* If auction is still ongoing, show highest bidder, otherwise show winner */}
                    {item.state === ItemState.Open && item.winner_name && (
                        <ListGroup.Item>
                            <strong>Highest bidder:</strong> {item.winner_name}
                        </ListGroup.Item>
                    )}
                    {item.state === ItemState.Sold && (
                        <ListGroup.Item>
                            <strong>Winner:</strong> {item.winner_name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <Card.Footer>
                    <Button
                        variant="primary"
                        onClick={() => handleShowItem(item.id)}
                    >
                        {item.state === ItemState.Open &&
                        auctionState === AuctionState.Running
                            ? "View and bid"
                            : "View"}
                    </Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
