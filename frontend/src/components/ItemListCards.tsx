/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import ItemCard from "./ItemCard";
import { Item } from "../types";

const ItemListCards = ({
    items,
    handleShowItem,
}: {
    items: Item[];
    handleShowItem: (itemId: number) => void;
}) => {
    return (
        <Container className="mt-4">
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

export default ItemListCards;
