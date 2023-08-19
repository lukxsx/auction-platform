import { Card, ListGroup, Button, Badge } from "react-bootstrap";
import { Item, ItemState, AuctionState, LoginUser } from "../types";
import { stateToStatus, myBidStatus } from "../utils/helpers";
import { BsStar, BsStarFill } from "react-icons/bs";
import { addFavorite } from "../reducers/favorites";
import InfoText from "./InfoText";
import "./favorite.css";
import { useDispatch } from "react-redux";

const ItemCard = ({
    item,
    handleShowItem,
    auctionState,
    user,
    favorite,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
    user: LoginUser;
    favorite: boolean;
}) => {
    const dispatch = useDispatch();
    const handleSetFavorite = () => {
        console.log("adding", item.id, "as favorite");
        dispatch(addFavorite(item.id));
    };

    return (
        <Card border={myBidStatus(user, item)}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title>{item.model}</Card.Title>
                    </div>
                    <input
                        type="checkbox"
                        id="starCheckbox"
                        checked={favorite}
                        onChange={(e) => {
                            console.log(e.target.checked);
                            console.log(item.id);
                            handleSetFavorite();
                        }}
                    />
                    <label htmlFor="starCheckbox" className="star-label">
                        {favorite ? (
                            <BsStarFill size="1.5em" />
                        ) : (
                            <BsStar size="1.5em" />
                        )}
                    </label>
                </div>

                <Card.Subtitle>{item.make}</Card.Subtitle>
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
