import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import auctionService from "./services/auctions";
import { Routes, Route, Navigate } from "react-router-dom";
import { setAuctions } from "./reducers/auctions";
import Layout from "./components/Layout";
import AuctionPage from "./components/AuctionPage";
import Home from "./components/Home";
import Login from "./components/Login";
import { RootState } from "./types";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => dispatch(setAuctions(auctions)));
    }, [dispatch]);
    const user = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = user !== null;
    return (
        <div>
            <Layout>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? <Home /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="auction/:id"
                        element={
                            isLoggedIn ? (
                                <AuctionPage />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="login" element={<Login />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;
