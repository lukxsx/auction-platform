import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuctionPage from "./components/AuctionPage";
import Home from "./components/Home";
import Login from "./components/Login";
import { RootState } from "./types";

function App() {
    const user = useSelector((state: RootState) => state.user.user);
    const isLoggedIn = user !== null;
    if (!isLoggedIn) return <Login />;
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
