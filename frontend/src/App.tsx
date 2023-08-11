import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Auctions from "./components/Auctions";
import auctionService from "./services/auctions";
import { setAuctions } from "./reducers/auctions";
import "normalize.css";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => dispatch(setAuctions(auctions)));
    }, [dispatch]);
    return (
        <div>
            <Auctions />
        </div>
    );
}

export default App;
