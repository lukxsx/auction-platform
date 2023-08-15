import { useEffect, useState } from "react";
import { Modal, ListGroup } from "react-bootstrap";
import { Item, Bid, ItemState } from "../types";
import itemService from "../services/items";
import BidTable from "./BidTable";
import BidForm from "./BidForm";
import InfoText from "./InfoText";

const ItemView = ({
    show,
    close,
    item,
}: {
    show: boolean;
    close: () => void;
    item: Item | undefined;
}) => {
    const [bids, setBids] = useState<Bid[]>([]);
    useEffect(() => {
        if (item) {
            itemService
                .getBids(item?.auction_id, item.id)
                .then((fetchedBids) => setBids(fetchedBids))
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [item]);
    if (!item) return <></>;
    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => close()}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {item.model}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item>
                        <strong>Model:</strong> {item.model}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Manufacturer:</strong> {item.make}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Starting price:</strong> {item.starting_price} €
                    </ListGroup.Item>
                    {(item.state === ItemState.Open ||
                        item.state === ItemState.Unsold) && (
                        <ListGroup.Item>
                            <strong>Current price:</strong> {item.current_price}{" "}
                            €
                        </ListGroup.Item>
                    )}
                    {item.state === ItemState.Sold && (
                        <ListGroup.Item>
                            <strong>Final price:</strong> {item.current_price} €
                        </ListGroup.Item>
                    )}
                    {item.info && <InfoText info={item.info} />}
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
                <BidForm item={item} />
                <BidTable bids={bids} />
            </Modal.Body>
        </Modal>
    );
};

export default ItemView;
