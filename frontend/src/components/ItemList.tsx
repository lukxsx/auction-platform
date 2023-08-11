import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setItems, selectItemsByAuctionId } from "../reducers/items";
import { RootState } from "../types";
import itemService from "../services/items";

const ItemList = ({ auctionId }: { auctionId: number }) => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) =>
        selectItemsByAuctionId(state, auctionId)
    );

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetching data");
            const fetchedItems = await itemService.getAll(auctionId);
            dispatch(setItems({ auctionId, items: fetchedItems }));
        };
        fetchData();
    }, [dispatch, auctionId]);

    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>{item.model}</div>
            ))}
        </div>
    );
};

export default ItemList;
