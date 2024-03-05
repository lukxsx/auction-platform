import { useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Modal } from "react-bootstrap";
import { Item, User } from "../../types";
import { updateItem } from "../../reducers/items";
import { useAlert } from "../../contexts/AlertContext";
import itemService from "../../services/items";
import userService from "../../services/users";
import ErrorHandlingService from "../../services/errors";
import Alert from "../Alert";

const OverrideForm = ({
    show,
    close,
    item,
    auctionId,
}: {
    show: boolean;
    close: () => void;
    item: Item;
    auctionId: number;
}) => {
    const dispatch = useDispatch();
    const { setAlert } = useAlert();

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState(0);
    const [price, setPrice] = useState(item.current_price);

    useEffect(() => {
        if (show)
            userService
                .getUsers()
                .then((userList) => setUsers(userList))
                .catch((error) => console.error(error));
    }, [show]);

    const handleUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(parseInt(event?.target.value, 10));
    };

    const handleWinnerOverride = async () => {
        if (selectedUser === 0) {
            setAlert("You need to select a user", "danger");
            return;
        }
        try {
            const updatedItem = await itemService.setWinner(
                auctionId,
                item.id,
                selectedUser,
                price,
            );

            dispatch(
                updateItem({
                    itemId: item.id,
                    updatedItem,
                }),
            );

            close();
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Modal show={show} onHide={() => close()}>
            <Modal.Header closeButton>
                <Modal.Title>Override winner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert />

                <p>
                    <b>Warning!</b> Overriding the winner will mark the item as
                    sold. Users can no longer bid on the item.
                </p>

                {/* Item code */}
                <Form.Group className="mb-2">
                    <Form.Label>User</Form.Label>
                    <Form.Select
                        aria-label="Default select example"
                        value={selectedUser}
                        onChange={handleUserChange}
                    >
                        <option value="0">Select user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Manufacturer */}
                <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        onChange={(e) => {
                            const inputText = e.target.value;
                            if (/^\d*$/.test(inputText)) {
                                setPrice(parseInt(inputText, 10));
                            }
                        }}
                    ></Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Form.Group className="mb-2">
                    <Button
                        variant="primary"
                        type="submit"
                        id="submit-item-edit"
                        onClick={() => handleWinnerOverride()}
                    >
                        Submit
                    </Button>
                </Form.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default OverrideForm;
