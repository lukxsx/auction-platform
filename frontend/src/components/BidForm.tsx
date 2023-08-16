import { useState, useEffect } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNotification } from "../contexts/NotificationContext";
import ErrorHandlingService from "../services/errors";
import { Item, RootState } from "../types";
import { atoi } from "../utils/helpers";
import bidService from "../services/bids";

const BidForm = ({ item }: { item: Item }) => {
    const { addNotification } = useNotification();
    const user = useSelector((state: RootState) => state.user.user);
    const [amount, setAmount] = useState(0);
    useEffect(() => setAmount(item.current_price + 1), [item.current_price]);

    const handleBid = async () => {
        try {
            if (!user) {
                throw new Error("User not found");
            }
            const newBid = await bidService.addBid({
                item_id: item.id,
                auction_id: item.auction_id,
                user_id: user?.id,
                price: amount,
            });
        } catch (error) {
            ErrorHandlingService.handleError(error, addNotification);
        }
    };

    return (
        <InputGroup className="mb-4 mt-3">
            <InputGroup.Text>Bid amount</InputGroup.Text>
            <Form.Control
                type="number"
                value={amount}
                onChange={(e) => {
                    setAmount(atoi(e.target.value));
                }}
            />
            <InputGroup.Text>€</InputGroup.Text>
            <Button variant="primary" type="submit" onClick={() => handleBid()}>
                Submit
            </Button>
        </InputGroup>
    );
};

export default BidForm;
