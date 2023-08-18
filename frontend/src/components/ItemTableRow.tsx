import { Button } from "react-bootstrap";
import { AuctionState, Item } from "../types";
import InfoText from "./InfoText";
import { stateToStatus } from "../utils/helpers";

const ItemTableRow = ({
    item,
    handleShowItem,
    auctionState,
}: {
    item: Item;
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
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
            <td>{item.winner_name}</td>
            <td>
                <Button
                    variant="primary"
                    onClick={() => handleShowItem(item.id)}
                >
                    Open
                </Button>
            </td>
        </tr>
    );
};

export default ItemTableRow;
