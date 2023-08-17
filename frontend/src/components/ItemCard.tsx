import { Card, ListGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Item, ItemState, RootState, LoginUser } from "../types";
import InfoText from "./InfoText";
import { stateToStatus } from "../utils/helpers";

// Using React Bootsrap's color definitions as the enum values
// to use these easily for changing colors
enum Status {
    Winning = "success",
    Losing = "danger",
    NotBidded = "",
}

// Check if the user has bidded on the item and are they winning
const myBidStatus = (user: LoginUser | null, item: Item): Status => {
    if (!user) return Status.NotBidded;
    if (item.winner_name) {
        if (item.winner_name === user.name) {
            return Status.Winning;
        } else if (item.bids.find((i) => i.username === user.name)) {
            return Status.Losing;
        }
    }

    return Status.NotBidded;
};

const ItemCard = ({
    item,
    handleShowItem,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
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
                    {item.info && <InfoText info={item.info} />}
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
                        {item.state === ItemState.Open
                            ? "View and bid"
                            : "View"}
                    </Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
