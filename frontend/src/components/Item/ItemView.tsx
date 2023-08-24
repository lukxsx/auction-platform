import { useState } from "react";
import { Modal, ListGroup, Button, Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
    AuctionState,
    Item,
    ItemState,
    LoginUser,
    WinStatus,
} from "../../types";
import { deleteItem } from "../../reducers/items";
import ErrorHandlingService from "../../services/errors";
import {
    isAdmin,
    myBidStatus,
    stateToStatus,
    winText,
} from "../../utils/helpers";
import BidTable from "./BidTable";
import BidForm from "./BidForm";
import InfoText from "../ItemList/InfoText";
import AlertModal from "../AlertModal";
import ItemForm from "./ItemForm";
import itemService from "../../services/items";
import { useAlert } from "../../contexts/AlertContext";
import { BACKEND_URL } from "../../utils/config";
import { useLightbox } from "../../contexts/LightboxContext";

const ItemView = ({
    close,
    items, // A list of all items in the auction
    itemId, // Selector for which item to show
    auctionState, // For checking if the auction is still running
    user,
}: {
    close: () => void;
    items: Item[];
    itemId: number;
    auctionState: AuctionState;
    user: LoginUser;
}) => {
    const dispatch = useDispatch();
    const { hideAlert } = useAlert();
    const { showLightbox } = useLightbox();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditItemForm, setShowEditItemForm] = useState(false);

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

    const winStatus = myBidStatus(user, item);

    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => {
                hideAlert();
                close();
            }}
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
            {/* Edit item form */}
            <ItemForm
                show={showEditItemForm}
                close={() => setShowEditItemForm(false)}
                auctionId={item.auction_id}
                item={item}
            />

            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {item.make} {item.model}{" "}
                    {winStatus !== WinStatus.NotBidded && (
                        <Badge bg={winStatus}>
                            {winText(winStatus, auctionState)}
                        </Badge>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {item.image_filename && (
                    <img
                        className="img-fluid mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            showLightbox(
                                `${BACKEND_URL}/images/${item.image_filename}`
                            );
                        }}
                        alt=""
                        src={`${BACKEND_URL}/images/small-${item.image_filename}`}
                    />
                )}
                {/* Admin buttons */}
                {isAdmin() && (
                    <div>
                        <Button
                            size="sm"
                            className="mb-3"
                            onClick={() => setShowEditItemForm(true)}
                        >
                            Edit
                        </Button>{" "}
                        <Button
                            variant="danger"
                            size="sm"
                            className="mb-3"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete
                        </Button>
                    </div>
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
