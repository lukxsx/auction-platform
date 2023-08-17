import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, ListGroup, Button } from "react-bootstrap";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { formatDate, isAdmin } from "../utils/helpers";
import { deleteAuction } from "../reducers/auctions";
import ItemList from "./ItemList";
import AddItem from "./AddItem";
import EditAuction from "./EditAuction";
import AlertModal from "./AlertModal";
import auctionService from "../services/auctions";
import ErrorHandlingService from "../services/errors";

const AuctionPage = () => {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auctionId = parseInt(id as string, 10);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );

    const [showItemAddForm, setShowItemAddForm] = useState(false);
    const [showEditAuctionForm, setShowEditAuctionForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!auction) return <p>Loading...</p>;

    // Code for deleting auction
    const handleDelete = async () => {
        try {
            await auctionService.deleteAuction(auction);
            dispatch(deleteAuction(auction.id));
            navigate("/");
        } catch (error) {
            ErrorHandlingService.handleError(error);
        }
    };

    return (
        <Container>
            {/* Form modals that can be launched */}
            <AddItem
                show={showItemAddForm}
                close={() => setShowItemAddForm(false)}
                auctionId={auctionId}
            />
            <EditAuction
                show={showEditAuctionForm}
                close={() => setShowEditAuctionForm(false)}
                auction={auction}
            />
            <AlertModal
                show={showDeleteConfirm}
                close={() => setShowDeleteConfirm(false)}
                action={() => handleDelete()}
                title="Are you sure?"
                message={
                    "Do you really want to delete auction " + auction.name + "?"
                }
            />

            {/* Auction details */}
            <ListGroup>
                <h1>{auction.name}</h1>
                <h4>
                    {formatDate(auction.start_date, false)} —{" "}
                    {formatDate(auction.end_date, false)}
                </h4>
            </ListGroup>

            {/* Admin buttons */}
            {isAdmin() && (
                <div className="mb-3">
                    <Button onClick={() => setShowEditAuctionForm(true)}>
                        Edit auction
                    </Button>{" "}
                    <Button onClick={() => setShowItemAddForm(true)}>
                        Add item
                    </Button>{" "}
                    <Button>Download report</Button>{" "}
                    <Button
                        variant="danger"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        Delete auction
                    </Button>
                </div>
            )}

            {/* Actual item list */}
            <ItemList auctionId={auctionId} auctionState={auction.state} />
        </Container>
    );
};

export default AuctionPage;
