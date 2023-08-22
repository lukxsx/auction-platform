import { Card, ListGroup, Button, Badge } from "react-bootstrap";
import { Item, ItemState, AuctionState, LoginUser } from "../types";
import { stateToStatus, myBidStatus } from "../utils/helpers";
import { BsStar, BsStarFill } from "react-icons/bs";
import InfoText from "./InfoText";

const ItemCard = ({
    item,
    handleShowItem,
    auctionState,
    user,
    favorite,
    handleFavoriteChange,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
    user: LoginUser;
    favorite: boolean;
    handleFavoriteChange: (itemId: number, isFavorite: boolean) => void;
}) => {
    return (
        <Card
            border={myBidStatus(user, item)}
            style={{ flex: 1 }}
            className="d-flex justify-content-between"
        >
            <div>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>{item.model}</Card.Title>
                        </div>

                        <Button
                            variant="link"
                            onClick={() =>
                                handleFavoriteChange(item.id, favorite)
                            }
                        >
                            {favorite ? (
                                <BsStarFill size="1.5em" />
                            ) : (
                                <BsStar size="1.5em" />
                            )}
                        </Button>
                    </div>

                    <Card.Subtitle>{item.make}</Card.Subtitle>
                </Card.Body>
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
                    {item.winner_name && (
                        <ListGroup.Item>
                            {item.state === ItemState.Open ? (
                                <strong>Highest bidder:</strong>
                            ) : (
                                <strong>Winner:</strong>
                            )}{" "}
                            {item.winner_name}{" "}
                            {user && item.winner_id === user.id && (
                                <Badge pill>You</Badge>
                            )}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </div>
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
        </Card>
    );
};

export default ItemCard;
