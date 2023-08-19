/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import { AuctionState, Item } from "../types";
import ItemCard from "./ItemCard";

const ItemListCards = ({
    items,
    handleShowItem,
    auctionState,
}: {
    items: Item[];
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
}) => {
    return (
        <Container className="mt-4">
            <Row>
                {items.map((item) => (
                    <Col key={item.id.toString()} md={4} className="mb-4">
                        <ItemCard
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ItemListCards;
