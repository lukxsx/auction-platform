import { useState, useEffect } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorHandlingService from "../services/errors";
import { Item, RootState } from "../types";
import bidService from "../services/bids";
import { addNotification } from "../reducers/notifications";

const BidForm = ({ item }: { item: Item }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [amount, setAmount] = useState(0);
    useEffect(() => setAmount(item.current_price + 1), [item.current_price]);

    const handleBid = async () => {
        try {
            if (!user) {
                throw new Error("User not found");
            }
            await bidService.addBid({
                item_id: item.id,
                auction_id: item.auction_id,
                user_id: user?.id,
                price: amount,
            });
            dispatch(
                addNotification({
                    title: "Info",
                    message: "A new bid was added on item " + item.model,
                    variant: "",
                })
            );
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>Bid on this item</Form.Label>
            <InputGroup className="mb-4">
                <InputGroup.Text>Bid amount</InputGroup.Text>
                <Form.Control
                    size="lg"
                    style={{ maxWidth: "20%" }}
                    type="number"
                    value={amount}
                    min={item.current_price + 1}
                    onChange={(e) => {
                        const inputText = e.target.value;
                        if (/^\d*$/.test(inputText)) {
                            setAmount(
                                inputText === ""
                                    ? item.current_price + 1
                                    : parseInt(inputText, 10)
                            );
                        }
                    }}
                />
                <InputGroup.Text>€</InputGroup.Text>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={() => handleBid()}
                >
                    Submit
                </Button>
            </InputGroup>
        </Form.Group>
    );
};

export default BidForm;
