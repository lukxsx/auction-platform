import { SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { addItem } from "../reducers/items";
import { InfoValue, NewItem } from "../types";
import InfoValues from "./InfoValues";
import itemService from "../services/items";
import ErrorHandlingService from "../services/errors";
import { useNotification } from "../contexts/NotificationContext";

const AddItem = ({
    show,
    close,
    auctionId,
}: {
    show: boolean;
    close: () => void;
    auctionId: number;
}) => {
    const dispatch = useDispatch();
    const { addNotification } = useNotification();
    const [code, setCode] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [startingPrice, setStartingPrice] = useState(0);
    const [info, setInfo] = useState("");
    const [infoAsText, setInfoAsText] = useState(false);
    const [infoValues, setInfoValues] = useState<InfoValue[]>([]);

    const handleAddItem = async (event: SyntheticEvent) => {
        event.preventDefault();
        try {
            const newItem: NewItem = {
                code,
                make,
                model,
                auction_id: auctionId,
                starting_price: startingPrice,
            };

            if (infoAsText) {
                newItem.info = info;
            } else if (infoValues.length !== 0) {
                // If info is passed as key-value pairs,
                // generate a JSON string from the values
                // and send it to the backend
                const infoObject: { [key: string]: string } = {};
                infoValues.forEach((item) => {
                    infoObject[item.key] = item.value;
                });
                newItem.info = JSON.stringify(infoObject);
            }
            const fetchedItem = await itemService.addItem(newItem);
            fetchedItem.bids = [];
            dispatch(addItem(fetchedItem));

            setCode("");
            setMake("");
            setModel("");
            setStartingPrice(0);
            setInfo("");
            setInfoValues([]);
            addNotification("Info", "New item addedd successfully", "");
        } catch (error) {
            ErrorHandlingService.handleError(error, addNotification);
        }
    };

    return (
        <Modal size="lg" show={show} onHide={() => close()}>
            <Modal.Header closeButton>
                <Modal.Title>Add item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddItem}>
                    <Form.Group className="mb-2">
                        <Form.Label>Item code</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Manufacturer</Form.Label>
                        <Form.Control
                            type="text"
                            value={make}
                            required
                            minLength={1}
                            maxLength={255}
                            onChange={(e) => setMake(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Model</Form.Label>
                        <Form.Control
                            type="text"
                            value={model}
                            minLength={1}
                            maxLength={255}
                            required
                            onChange={(e) => setModel(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Starting price</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={startingPrice}
                                min={0}
                                required
                                onChange={(e) => {
                                    const inputText = e.target.value;
                                    if (/^\d*$/.test(inputText)) {
                                        setStartingPrice(
                                            inputText === ""
                                                ? 0
                                                : parseInt(inputText, 10)
                                        );
                                    }
                                }}
                            />
                            <InputGroup.Text>€</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Info</Form.Label>
                        <Form.Check
                            type="switch"
                            id="text-switch"
                            label="Info as text"
                            onChange={() => {
                                setInfoAsText(!infoAsText);
                                setInfo("");
                            }}
                        />
                        {infoAsText && (
                            <Form.Control
                                type="text"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                            ></Form.Control>
                        )}
                        {!infoAsText && (
                            <InfoValues
                                infoValues={infoValues}
                                setInfoValues={setInfoValues}
                            />
                        )}
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddItem;
