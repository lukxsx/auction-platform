/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Sidebar from "./Sidebar/Sidebar";
import Notification from "./Notification";
import auctionService from "../services/auctions";
import { setAuctions } from "../reducers/auctions";
import ErrorHandlingService from "../services/errors";

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

    return (
        <Container fluid>
            <Row>
                <Sidebar />
                <Col sm={8} md={9} className="content">
                    <Notification />
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
