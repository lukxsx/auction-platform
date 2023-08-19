/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Table } from "react-bootstrap";
import { Item, AuctionState, LoginUser } from "../types";
import ItemTableRow from "./ItemTableRow";

const ItemListTable = ({
    items,
    handleShowItem,
    auctionState,
    user,
    favoriteIds,
}: {
    items: Item[];
    handleShowItem: (itemId: number) => void;
    auctionState: AuctionState;
    user: LoginUser;
    favoriteIds: number[];
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
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <ItemTableRow
                            key={item.id.toString()}
                            item={item}
                            handleShowItem={handleShowItem}
                            auctionState={auctionState}
                            user={user}
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ItemListTable;
