import { Badge, Button } from "react-bootstrap";
import { AuctionState, Item, LoginUser } from "../types";
import { stateToStatus } from "../utils/helpers";
import InfoText from "./InfoText";
import FavoriteButton from "./FavoriteButton";

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
    const changeFavorite = () => handleFavoriteChange(item.id, favorite);
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
                <FavoriteButton
                    favorite={favorite}
                    changeFavorite={changeFavorite}
                />
            </td>
        </tr>
    );
};

export default ItemTableRow;
