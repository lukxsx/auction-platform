import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import { RootState } from "../types";
import itemService from "../services/items";

import ItemCard from "./ItemCard";

const ItemList = ({ auctionId }: { auctionId: number }) => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) =>
        selectItemsByAuctionId(state, auctionId)
    );

    useEffect(() => {
        const fetchData = async () => {
            const fetchedItems = await itemService.getAll(auctionId);
            dispatch(setItems({ auctionId, items: fetchedItems }));
        };
        fetchData();
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
