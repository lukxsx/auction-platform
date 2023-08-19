/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuctionState, RootState } from "../types";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import itemService from "../services/items";
import ErrorHandlingService from "../services/errors";
import ItemView from "./ItemView";
import ItemListCards from "./ItemListCards";
import ItemListTable from "./ItemListTable";

// https://v5.reactrouter.com/web/example/query-parameters
const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
};

const ItemList = ({
    auctionId,
    auctionState, // Used for showind different fields based on the current state
    view, // Card or table view?
}: {
    auctionId: number;
    auctionState: AuctionState;
    view: string;
}) => {
    const dispatch = useDispatch();
    const items = useSelector(selectItemsByAuctionId(auctionId));
    const user = useSelector((state: RootState) => state.user.user);
    const favoriteIds = useSelector((state: RootState) => state.favorites);
    const navigate = useNavigate();
    let query = useQuery();
    console.log("FIDs:", favoriteIds);

    // Check if ?item query parameter was given
    const itemParamString = query.get("item");
    let itemParam = itemParamString ? parseInt(itemParamString, 10) : 0;

    const [selectedItemId, setSelectedItemId] = useState(itemParam); // modal is hidden when 0

    // Change item if item param changes
    useEffect(() => setSelectedItemId(itemParam), [itemParam]);

    // Fetch items of this auction
    useEffect(() => {
        itemService
            .getAll(auctionId)
            .then((fetchedItems) => dispatch(setItems(fetchedItems)))
            .catch((error) => {
                ErrorHandlingService.handleError(error);
            });
    }, [dispatch, auctionId]);

    // Show the item view modal
    const handleShowItem = (itemId: number) => {
        const selectedItem = items.find((i) => i.id === itemId);
        setSelectedItemId(selectedItem ? selectedItem.id : 0);
    };

    // Close item view modal
    const closeItemView = () => {
        setSelectedItemId(0);
        navigate(`/auction/${auctionId}`);
    };

    // Make sure user exists
    if (!user) return <></>;

    return (
        <>
            <ItemView
                items={items}
                itemId={selectedItemId}
                close={closeItemView}
                auctionState={auctionState}
                user={user}
            />
            {view === "cards" && (
                <ItemListCards
                    auctionState={auctionState}
                    items={items}
                    handleShowItem={handleShowItem}
                    user={user}
                    favoriteIds={favoriteIds}
                />
            )}
            {view === "table" && (
                <ItemListTable
                    auctionState={auctionState}
                    items={items}
                    handleShowItem={handleShowItem}
                    user={user}
                    favoriteIds={favoriteIds}
                />
            )}
        </>
    );
};

export default ItemList;
