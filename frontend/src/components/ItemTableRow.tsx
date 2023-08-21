import { Badge, Button } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";
import { AuctionState, Item, LoginUser } from "../types";
import { stateToStatus } from "../utils/helpers";
import InfoText from "./InfoText";

const ItemTableRow = ({
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
        <tr>
            {/*<td>{item.code}</td>*/}
            <td>{item.make}</td>
            <td>{item.model}</td>
            <td>
                {item.info ? (
                    <InfoText addPrefix={false} info={item.info} />
                ) : (
                    ""
                )}
            </td>
            <td>
                {auctionState === AuctionState.Pending
                    ? "Waiting"
                    : stateToStatus(item.state)}
            </td>
            <td>{item.starting_price} €</td>
            <td>{item.current_price} €</td>
            <td>
                {item.winner_name}{" "}
                {user && item.winner_id === user.id && <Badge pill>You</Badge>}
            </td>
            <td style={{ textAlign: "center" }}>
                <Button
                    variant="primary"
                    onClick={() => handleShowItem(item.id)}
                >
                    Open
                </Button>
            </td>
            <td style={{ textAlign: "center" }}>
                <Button
                    variant="link"
                    onClick={() => handleFavoriteChange(item.id, favorite)}
                >
                    {favorite ? (
                        <BsStarFill size="1.5em" />
                    ) : (
                        <BsStar size="1.5em" />
                    )}
                </Button>
            </td>
        </tr>
    );
};

export default ItemTableRow;
