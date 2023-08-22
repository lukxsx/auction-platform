/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import { AuctionState, Item, LoginUser } from "../types";
import ItemCard from "./ItemCard";

const ItemListCards = ({
    items,
    favorites,
    handleShowItem,
    auctionState,
    user,
    handleFavoriteChange,
}: {
    items: Item[];
    favorites: Item[];
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
    user: LoginUser;
    handleFavoriteChange: (itemId: number, isFavorite: boolean) => void;
}) => {
    return (
        <Container className="mt-4">
            <Row>
                {favorites.map((item) => (
                    <Col
                        key={item.id.toString()}
                        md={4}
                        className="mb-4 justify-content-between"
                        style={{
                            display: "flex",
                        }}
                    >
                        <ItemCard
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                            user={user}
                            favorite={true}
                            handleFavoriteChange={handleFavoriteChange}
                        />
                    </Col>
                ))}
            </Row>
            {favorites.length > 0 && <hr className="mt-0" />}
            <Row>
                {items.map((item) => (
                    <Col
                        key={item.id.toString()}
                        md={4}
                        className="mb-4 justify-content-between"
                        style={{
                            display: "flex",
                        }}
                    >
                        <ItemCard
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                            user={user}
                            favorite={false}
                            handleFavoriteChange={handleFavoriteChange}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ItemListCards;
