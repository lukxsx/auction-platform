import { useState } from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AuctionState, Item, ItemState } from "../types";
import { deleteItem } from "../reducers/items";
import ErrorHandlingService from "../services/errors";
import { isAdmin, stateToStatus } from "../utils/helpers";
import BidTable from "./BidTable";
import BidForm from "./BidForm";
import InfoText from "./InfoText";
import AlertModal from "./AlertModal";
import itemService from "../services/items";

const ItemView = ({
    close,
    items, // A list of all items in the auction
    itemId, // Selector for which item to show
    auctionState, // For checking if the auction is still running
}: {
    close: () => void;
    items: Item[];
    itemId: number;
    auctionState: AuctionState;
}) => {
    const dispatch = useDispatch();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Select item to show
    const show = itemId !== 0;
    const item = items.find((i) => i.id === itemId);
    if (!item) {
        return <></>;
    }

    const handleDelete = async () => {
        try {
            setShowDeleteConfirm(false);
            await itemService.deleteItem(item);
            dispatch(deleteItem(item.id));
            close();
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => close()}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            {/* Delete confirmation */}
            <AlertModal
                show={showDeleteConfirm}
                close={() => setShowDeleteConfirm(false)}
                action={() => handleDelete()}
                title="Are you sure?"
                message={
                    "Do you really want to delete item " + item.model + "?"
                }
            />
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {item.make} {item.model}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isAdmin() && (
                    <Button
                        variant="danger"
                        size="sm"
                        className="mb-3"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete
                    </Button>
                )}
                <ListGroup className="mb-3">
                    <ListGroup.Item>
                        <strong>Manufacturer:</strong> {item.make}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Model:</strong> {item.model}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Starting price:</strong> {item.starting_price} €
                    </ListGroup.Item>
                    {/* If item is not sold yet, show "current price" */}
                    {(item.state === ItemState.Open ||
                        item.state === ItemState.Unsold) && (
                        <ListGroup.Item>
                            <strong>Current price:</strong> {item.current_price}{" "}
                            €
                        </ListGroup.Item>
                    )}
                    {/* Show current price as "final price" if item is sold */}
                    {item.state === ItemState.Sold && (
                        <ListGroup.Item>
                            <strong>Final price:</strong> {item.current_price} €
                        </ListGroup.Item>
                    )}
                    {/* Show item info only if it exists */}
                    {item.info && (
                        <InfoText addPrefix={true} info={item.info} />
                    )}
                    <ListGroup.Item>
                        <strong>Status:</strong>{" "}
                        {auctionState === AuctionState.Pending
                            ? "Waiting"
                            : stateToStatus(item.state)}
                    </ListGroup.Item>
                    {/* If auction is still ongoing, show highest bidder */}
                    {item.state === ItemState.Open && item.winner_name && (
                        <ListGroup.Item>
                            <strong>Highest bidder:</strong> {item.winner_name}
                        </ListGroup.Item>
                    )}
                    {/* Otherwise show winner */}
                    {item.state === ItemState.Sold && (
                        <ListGroup.Item>
                            <strong>Winner:</strong> {item.winner_name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
                {/* Show bidding form only if the auction is ongoing */}
                {item.state === ItemState.Open &&
                    auctionState === AuctionState.Running && (
                        <BidForm item={item} />
                    )}
                <BidTable bids={item.bids} />
            </Modal.Body>
        </Modal>
    );
};

export default ItemView;
