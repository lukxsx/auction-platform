/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import auctionService from "../services/auctions";
import itemService from "../services/items";
import socketService from "../services/socket";
import ErrorHandlingService from "../services/errors";
import { setAuctions } from "../reducers/auctions";
import { setItems } from "../reducers/highestBids";
import { RootState } from "../types";
import Notification from "./NotificationToast";
import NavBar from "./NavBar";

const Layout = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    // Get auctions
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

    // Get wins by the current user
    useEffect(() => {
        if (user) {
            itemService
                .getWonItemsByUser(user.id)
                .then((wonItems) =>
                    dispatch(setItems(wonItems.map((item) => item.id))),
                )
                .catch((error) => {
                    ErrorHandlingService.handleError(error);
                });
        }
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
