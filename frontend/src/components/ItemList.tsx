/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import socketService from "../services/socket";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import itemService from "../services/items";
import ItemView from "./ItemView";
import ItemCard from "./ItemCard";
import { isAxiosError } from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { AuctionState } from "../types";

const ItemList = ({
    auctionId,
    auctionState, // Used for showind different fields based on the current state
}: {
    auctionId: number;
    auctionState: AuctionState;
}) => {
    const { addNotification } = useNotification();
    const dispatch = useDispatch();
    const items = useSelector(selectItemsByAuctionId(auctionId));

    const [selectedItemId, setSelectedItemId] = useState(0); // modal is hidden when 0

    // Fetch items of this auction
    useEffect(() => {
        itemService
            .getAll(auctionId)
            .then((fetchedItems) => dispatch(setItems(fetchedItems)))
            .catch((error) => {
                if (isAxiosError(error)) {
                    addNotification(
                        "Error",
                        error.response?.data?.error,
                        "danger"
                    );
                } else {
                    addNotification("Error", "Something happened", "danger");
                    console.error(error);
                }
            });
    }, [dispatch, auctionId]);

    // Listen on a websocket to catch new updates
    useEffect(() => {
        socketService.connect();

        return () => {
            socketService.disconnect();
        };
    }, []);

    // Show the item view modal
    const handleShowItem = (itemId: number) => {
        const selectedItem = items.find((i) => i.id === itemId);
        setSelectedItemId(selectedItem ? selectedItem.id : 0);
    };

    // Close item view modal
    const closeItemView = () => setSelectedItemId(0);

    return (
        <Container className="mt-4">
            <ItemView
                items={items}
                itemId={selectedItemId}
                close={closeItemView}
                auctionState={auctionState}
            />
            <Row>
                {items.map((item) => (
                    <Col key={item.id.toString()} md={4} className="mb-4">
                        <ItemCard item={item} handleShowItem={handleShowItem} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ItemList;
