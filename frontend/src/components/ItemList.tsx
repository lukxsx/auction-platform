/* eslint-disable react-hooks/exhaustive-deps */
import { Tab, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socketService from "../services/socket";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import itemService from "../services/items";
import ItemView from "./ItemView";
import { useNotification } from "../contexts/NotificationContext";
import { AuctionState } from "../types";
import ItemListCards from "./ItemListCards";
import ItemListTable from "./ItemListTable";
import ErrorHandlingService from "../services/errors";

const ItemList = ({
    auctionId,
    auctionState, // Used for showind different fields based on the current state
}: {
    auctionId: number;
    auctionState: AuctionState;
}) => {
    const { addNotification } = useNotification();
    const dispatch = useDispatch();
    const items = useSelector(selectItemsByAuctionId(auctionId));

    const [selectedItemId, setSelectedItemId] = useState(0); // modal is hidden when 0
    const [view, setView] = useState("cards");

    // Fetch items of this auction
    useEffect(() => {
        itemService
            .getAll(auctionId)
            .then((fetchedItems) => dispatch(setItems(fetchedItems)))
            .catch((error) => {
                ErrorHandlingService.handleError(error, addNotification);
            });
    }, [dispatch, auctionId]);

    // Listen on a websocket to catch new updates
    useEffect(() => {
        socketService.connect();

        return () => {
            socketService.disconnect();
        };
    }, []);

    // Show the item view modal
    const handleShowItem = (itemId: number) => {
        const selectedItem = items.find((i) => i.id === itemId);
        setSelectedItemId(selectedItem ? selectedItem.id : 0);
    };

    // Close item view modal
    const closeItemView = () => setSelectedItemId(0);

    return (
        <>
            <Tabs
                activeKey={view}
                onSelect={(k) => setView(k as string)}
                className="mb-3"
            >
                <Tab eventKey="cards" title="Card view"></Tab>
                <Tab eventKey="table" title="List view"></Tab>
            </Tabs>
            <ItemView
                items={items}
                itemId={selectedItemId}
                close={closeItemView}
                auctionState={auctionState}
            />
            {view === "cards" && (
                <ItemListCards items={items} handleShowItem={handleShowItem} />
            )}
            {view === "table" && (
                <ItemListTable items={items} handleShowItem={handleShowItem} />
            )}
        </>
    );
};

export default ItemList;
