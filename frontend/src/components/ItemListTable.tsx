/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Table } from "react-bootstrap";
import ItemTableRow from "./ItemTableRow";
import { Item, AuctionState } from "../types";

const ItemListTable = ({
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
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ItemListTable;
