import { useDispatch } from "react-redux";
import { useEffect } from "react";
import auctionService from "./services/auctions";
import { Routes, Route } from "react-router-dom";
import { setAuctions } from "./reducers/auctions";
import Layout from "./components/Layout";
import AuctionPage from "./components/AuctionPage";
import Home from "./components/Home";
import Login from "./components/Login";

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
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="auction/:id" element={<AuctionPage />} />
                    <Route path="login" element={<Login />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;
