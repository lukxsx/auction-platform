import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { InputGroup, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Item, RootState } from "../../types";
import { useAlert } from "../../contexts/AlertContext";
import bidService from "../../services/bids";
import Alert from "../Alert";

const BidForm = ({ item }: { item: Item }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const { setAlert } = useAlert();
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
            setAlert("Bid added", "success");
        } catch (error) {
            // The error handler service only supports toast notifications
            // But I want to use Alert badge notifications here.
            // Should add error handling function with Alert badge support
            if (isAxiosError(error) && error.response?.data) {
                setAlert(error.response?.data.error, "danger");
            } else if (error instanceof Error) {
                setAlert(error.message, "danger");
            } else {
                setAlert("Something bad happened", "danger");
            }
        }
    };

    return (
        <Form.Group className="mb-3">
            <Alert />
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
