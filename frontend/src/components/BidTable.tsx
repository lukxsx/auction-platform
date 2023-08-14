import { Table } from "react-bootstrap";
import { Bid } from "../types";
import { formatDate } from "../utils/helpers";

const BidTable = ({ bids }: { bids: Bid[] }) => {
    if (bids.length === 0) return <>No bids.</>;

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Price</th>
                    <th>User</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {bids.map((bid) => (
                    <tr key={bid.id}>
                        <td>{bid.id}</td>
                        <td>{bid.price}</td>
                        <td>{bid.username}</td>
                        <td>{formatDate(new Date(bid.created_at))}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default BidTable;
