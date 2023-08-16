/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Table } from "react-bootstrap";
import ItemTableRow from "./ItemTableRow";
import { Item } from "../types";

const ItemListTable = ({
    items,
    handleShowItem,
}: {
    items: Item[];
    handleShowItem: (itemId: number) => void;
}) => {
    return (
        <Container className="mt-4">
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Manufacturer</th>
                        <th>Model</th>
                        <th>Info</th>
                        <th>Status</th>
                        <th>Starting price</th>
                        <th>Current price</th>
                        <th>Highest bidder</th>
                        <th>View and bid</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <ItemTableRow
                            key={item.id.toString()}
                            item={item}
                            handleShowItem={handleShowItem}
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ItemListTable;
