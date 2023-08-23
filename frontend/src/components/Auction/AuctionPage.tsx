import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Badge, Card, Tabs, Tab } from "react-bootstrap";
import { AuctionState, RootState } from "../../types";
import { selectAuctionById, deleteAuction } from "../../reducers/auctions";
import auctionService from "../../services/auctions";
import ErrorHandlingService from "../../services/errors";
import { capitalize, formatDate, isAdmin } from "../../utils/helpers";
import AddItem from "../Item/ItemForm";
import AlertModal from "../AlertModal";
import AuctionForm from "./AuctionForm";
import ItemList from "../ItemList/ItemList";

const AuctionPage = () => {
    let { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auctionId = parseInt(id as string, 10);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );

    useEffect(() => {
        document.title = `${auction?.name} - Auctions`;
    }, [auction]);

    const [showItemAddForm, setShowItemAddForm] = useState(false);
    const [showEditAuctionForm, setShowEditAuctionForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [view, setView] = useState("cards");

    if (!auction) return <p>Loading...</p>;

    // Code for deleting auction
    const handleDelete = async () => {
        try {
            setShowDeleteConfirm(false);
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
            <AuctionForm
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
            <Card>
                <Card.Header>
                    <div style={{ fontSize: "16pt" }}>
                        <strong>{auction.name}</strong>{" "}
                        <Badge
                            bg={
                                auction.state === AuctionState.Running
                                    ? "success"
                                    : "secondary"
                            }
                            pill
                        >
                            {capitalize(auction.state)}
                        </Badge>
                    </div>
                    <Badge bg="secondary">
                        Starts: {formatDate(auction.start_date, false)}
                    </Badge>{" "}
                    <Badge bg="secondary" className="mb-2">
                        Ends: {formatDate(auction.end_date, false)}
                    </Badge>
                    {/* Admin buttons */}
                    {isAdmin() && (
                        <div className="mb-2">
                            <Button
                                size="sm"
                                onClick={() => setShowEditAuctionForm(true)}
                            >
                                Edit auction
                            </Button>{" "}
                            <Button
                                size="sm"
                                onClick={() => setShowItemAddForm(true)}
                            >
                                Add a new item
                            </Button>{" "}
                            <Button size="sm">Download report</Button>{" "}
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete auction
                            </Button>
                        </div>
                    )}
                    <Tabs
                        activeKey={view}
                        onSelect={(k) => setView(k as string)}
                    >
                        <Tab eventKey="cards" title="Card view"></Tab>
                        <Tab eventKey="table" title="List view"></Tab>
                    </Tabs>
                </Card.Header>
                <Card.Body>
                    {/* Actual item list */}
                    <ItemList
                        view={view}
                        auctionId={auctionId}
                        auctionState={auction.state}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AuctionPage;
