import { SyntheticEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import ErrorHandlingService from "../services/errors";
import { Auction } from "../types";
import { createAuction, updateAuction } from "../reducers/auctions";
import auctionService from "../services/auctions";
import Alert from "./Alert";
import { useAlert } from "../contexts/AlertContext";

const EditAuction = ({
    show,
    close,
    auction,
}: {
    show: boolean;
    close: () => void;
    auction?: Auction;
}) => {
    const dispatch = useDispatch();
    const { setAlert } = useAlert();
    const [name, setName] = useState(auction ? auction.name : "");
    const [startTime, setStartTime] = useState(
        auction ? auction.start_date.toTimeString().slice(0, 5) : ""
    );
    const [startDate, setStartDate] = useState(
        auction ? auction.start_date.toISOString().slice(0, 10) : ""
    );
    const [endTime, setEndTime] = useState(
        auction ? auction.end_date.toTimeString().slice(0, 5) : ""
    );
    const [endDate, setEndDate] = useState(
        auction ? auction.end_date.toISOString().slice(0, 10) : ""
    );

    const handleEditAuction = async (event: SyntheticEvent) => {
        event.preventDefault();

        const isValidDate = (dateString: string): boolean => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(dateString);
        };

        const isValidTime = (timeString: string): boolean => {
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
            return timeRegex.test(timeString);
        };

        try {
            // Create date objects from input values
            if (
                !isValidDate(startDate) ||
                !isValidDate(endDate) ||
                !isValidTime(startTime) ||
                !isValidTime(endTime)
            ) {
                throw new Error("Invalid time or date");
            }
            const startDateObject = new Date(`${startDate}T${startTime}`);
            const endDateObject = new Date(`${endDate}T${endTime}`);

            // Are we creating a new auction or editing existing one?
            if (!auction) {
                // Create new
                const newAuction = {
                    name,
                    start_date: startDateObject,
                    end_date: endDateObject,
                };
                const auctionFromApi = await auctionService.createAuction(
                    newAuction
                );

                // Convert dates into correct Date objects
                auctionFromApi.start_date = new Date(auctionFromApi.start_date);
                auctionFromApi.end_date = new Date(auctionFromApi.end_date);

                // Dispatch the update
                dispatch(createAuction(auctionFromApi));
                setAlert("Successfully added new auction", "success");
                setName("");
                setStartDate("");
                setStartTime("");
                setEndDate("");
                setEndTime("");
            } else {
                // Edit auction
                // Generate and send auction update
                const auctionUpdate: Auction = {
                    ...auction,
                    name,
                    start_date: startDateObject,
                    end_date: endDateObject,
                };

                const updatedAuction = await auctionService.updateAuction(
                    auctionUpdate
                );

                // Convert dates into correct Date objects
                updatedAuction.start_date = new Date(updatedAuction.start_date);
                updatedAuction.end_date = new Date(updatedAuction.end_date);

                // Dispatch the update
                dispatch(updateAuction({ updatedAuction }));
                close();
            }
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Modal size="lg" show={show} onHide={() => close()}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {auction ? "Edit auction" : "Add auction"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert />
                <Form onSubmit={handleEditAuction}>
                    <Form.Group className="mb-2">
                        <Form.Label>Auction name</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Start date</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <Form.Control
                                type="time"
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>End date</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <Form.Control
                                type="time"
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </InputGroup>
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

export default EditAuction;
