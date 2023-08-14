import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import { RootState } from "../types";
import itemService from "../services/items";

import ItemCard from "./ItemCard";
import { isAxiosError } from "axios";
import { useNotification } from "../contexts/NotificationContext";

const ItemList = ({ auctionId }: { auctionId: number }) => {
    const { addNotification } = useNotification();
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) =>
        selectItemsByAuctionId(state, auctionId)
    );

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

    return (
        <Container className="mt-4">
            <Row>
                {items.map((item) => (
                    <Col key={item.id.toString()} md={4} className="mb-4">
                        <ItemCard item={item} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ItemList;
