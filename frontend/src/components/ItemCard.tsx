import { Card, ListGroup, Button } from "react-bootstrap";
import { Item, ItemState } from "../types";
import InfoText from "./InfoText";

const ItemCard = ({
    item,
    handleShowItem,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
}) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{item.model}</Card.Title>
                <Card.Subtitle>{item.make}</Card.Subtitle>
                <hr />
                <ListGroup className="list-group-flush">
                    {item.info && <InfoText info={item.info} />}
                    <ListGroup.Item>
                        <strong>Starting price:</strong> {item.starting_price} €
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Current price:</strong> {item.current_price} €
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Status:</strong> {item.state}
                    </ListGroup.Item>
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
                        View and bid
                    </Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
