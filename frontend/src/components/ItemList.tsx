import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import socketService from "../services/socket";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import { RootState, Item } from "../types";
import itemService from "../services/items";

import ItemView from "./ItemView";
import ItemCard from "./ItemCard";
import { isAxiosError } from "axios";
import { useNotification } from "../contexts/NotificationContext";

const ItemList = ({ auctionId }: { auctionId: number }) => {
    const { addNotification } = useNotification();
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) =>
        selectItemsByAuctionId(state, auctionId)
    );

    const [selectedItem, setSelectedItem] = useState<Item | undefined>(
        undefined
    );
    const [showItemView, setShowItemView] = useState(false);

    const closeItemView = () => {
        setShowItemView(false);
        setSelectedItem(undefined);
    };

    useEffect(() => {
        itemService
            .getAll(auctionId)
            .then((fetchedItems) =>
                dispatch(setItems({ auctionId, items: fetchedItems }))
            )
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

    useEffect(() => {
        socketService.connect();

        return () => {
            socketService.disconnect();
        };
    }, []);
    const handleShowItem = (itemId: number) => {
        setSelectedItem(items.find((i) => i.id === itemId));
        setShowItemView(true);
    };

    return (
        <Container className="mt-4">
            <ItemView
                item={selectedItem}
                show={showItemView}
                close={closeItemView}
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
