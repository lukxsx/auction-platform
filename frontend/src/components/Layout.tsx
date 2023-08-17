/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Notification from "./Notification";
import auctionService from "../services/auctions";
import { setAuctions } from "../reducers/auctions";
import ErrorHandlingService from "../services/errors";
import socketService from "../services/socket";
import NavBar from "./NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => {
                auctions.forEach((auction) => {
                    auction.start_date = new Date(auction.start_date);
                    auction.end_date = new Date(auction.end_date);
                });
                dispatch(setAuctions(auctions));
            })
            .catch((error) => {
                ErrorHandlingService.handleError(error);
            });
    }, [dispatch]);

    useEffect(() => {
        socketService.connect();

        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <div>
            <NavBar />
            <Container fluid="md">
                <Notification />
                {children}
            </Container>
        </div>
    );
};

export default Layout;
