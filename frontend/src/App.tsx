import { useDispatch } from "react-redux";
import { useEffect } from "react";
import auctionService from "./services/auctions";
import { setAuctions } from "./reducers/auctions";
import Layout from "./components/Layout";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => dispatch(setAuctions(auctions)));
    }, [dispatch]);
    return (
        <div>
            <Layout>
                <p>Hello</p>
            </Layout>
        </div>
    );
}

export default App;
