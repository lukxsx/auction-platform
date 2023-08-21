/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Table } from "react-bootstrap";
import { Item, AuctionState, LoginUser } from "../types";
import ItemTableRow from "./ItemTableRow";

const ItemListTable = ({
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
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        {/*<th>ID</th>*/}
                        <th>Manufacturer</th>
                        <th>Model</th>
                        <th>Info</th>
                        <th>Status</th>
                        <th>Starting price</th>
                        <th>Current price</th>
                        {(auctionState === AuctionState.Finished && (
                            <th>Winner</th>
                        )) || <th>Highest bidder</th>}
                        <th>View and bid</th>
                        <th>Favorite</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.map((item) => (
                        <ItemTableRow
                            key={item.id.toString()}
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                            user={user}
                            favorite={true}
                            handleFavoriteChange={handleFavoriteChange}
                        />
                    ))}
                    {items.map((item) => (
                        <ItemTableRow
                            key={item.id.toString()}
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                            user={user}
                            favorite={false}
                            handleFavoriteChange={handleFavoriteChange}
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ItemListTable;
