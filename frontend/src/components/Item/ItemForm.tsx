import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import { InfoValue, Item, NewItem } from "../../types";
import { addItem, updateItem } from "../../reducers/items";
import { useAlert } from "../../contexts/AlertContext";
import itemService from "../../services/items";
import imageService from "../../services/images";
import ErrorHandlingService from "../../services/errors";
import Alert from "../Alert";
import InfoValues from "./InfoValues";
import { isJson, parseInfoValues } from "../../utils/helpers";

const ItemForm = ({
    show,
    close,
    auctionId,
    item,
}: {
    show: boolean;
    close: () => void;
    auctionId: number;
    item?: Item;
}) => {
    const dispatch = useDispatch();
    const { setAlert } = useAlert();
    const [code, setCode] = useState(item ? item.code : "");
    const [make, setMake] = useState(item ? item.make : "");
    const [model, setModel] = useState(item ? item.model : "");
    const [startingPrice, setStartingPrice] = useState(
        item ? item.starting_price : 0
    );
    const [info, setInfo] = useState(item ? item.info : "");
    const [infoAsText, setInfoAsText] = useState(
        item && item.info ? !isJson(item.info) : false
    );
    const [infoValues, setInfoValues] = useState<InfoValue[]>(
        item && item.info && !infoAsText ? parseInfoValues(item.info) : []
    );

    // Image upload file
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
        }
    };

    // Upload image if needed
    const handleUpload = async (itemId: number) => {
        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            await imageService.uploadImage(itemId, formData);
        }
    };

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

            // Update or add?
            if (item) {
                // Update
                const itemUpdate: Item = {
                    ...newItem,
                    current_price:
                        item.current_price < startingPrice
                            ? startingPrice
                            : item.current_price,
                    state: item.state,
                    bids: item.bids,
                    id: item.id,
                };
                const updatedItemFromAPI = await itemService.updateItem(
                    itemUpdate
                );

                // Upload image if added
                handleUpload(updatedItemFromAPI.id);

                dispatch(
                    updateItem({
                        itemId: item.id,
                        updatedItem: updatedItemFromAPI,
                    })
                );
                setAlert("Successfully updated item", "success");
            } else {
                // Add
                const fetchedItem = await itemService.addItem(newItem);
                fetchedItem.bids = [];
                dispatch(addItem(fetchedItem));

                // Upload item if needed
                handleUpload(fetchedItem.id);

                setAlert("Successfully added new item", "success");
                setCode("");
                setMake("");
                setModel("");
                setStartingPrice(0);
                setInfo("");
                setInfoValues([]);
            }
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Modal size="lg" show={show} onHide={() => close()}>
            <Modal.Header closeButton>
                <Modal.Title>{item ? "Edit item" : "Add item"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert />

                {/* Item code */}
                <Form onSubmit={handleAddItem}>
                    <Form.Group className="mb-2">
                        <Form.Label>Item code</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </Form.Group>

                    {/* Manufacturer */}
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

                    {/* Model */}
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

                    {/* Starting price */}
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

                    {/* Info */}
                    <Form.Group className="mb-2">
                        <Form.Label>Info</Form.Label>
                        <Form.Check
                            type="switch"
                            id="text-switch"
                            label="Info as text"
                            onChange={(e) => {
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

                    {/* Image upload */}
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
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

export default ItemForm;
