/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import { AuctionState, Item, LoginUser } from "../types";
import ItemCard from "./ItemCard";

const ItemListCards = ({
    items,
    handleShowItem,
    auctionState,
    user,
}: {
    items: Item[];
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
    user: LoginUser;
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
                            user={user}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ItemListCards;
