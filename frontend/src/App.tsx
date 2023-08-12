import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ItemList from "./components/ItemList";
import auctionService from "./services/auctions";
import { setAuctions } from "./reducers/auctions";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => dispatch(setAuctions(auctions)));
    }, [dispatch]);
    return (
        <div>
            <ItemList auctionId={1} />
        </div>
    );
}

export default App;
