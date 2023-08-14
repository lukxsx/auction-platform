import React, { ReactNode, useEffect } from "react";
import { isAxiosError } from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import Notification from "./Notification";
import { useDispatch } from "react-redux";
import auctionService from "../services/auctions";
import { useNotification } from "../contexts/NotificationContext";
import { setAuctions } from "../reducers/auctions";

const Layout = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch();
    const { addNotification } = useNotification();

    useEffect(() => {
        auctionService
            .getAll()
            .then((auctions) => dispatch(setAuctions(auctions)))
            .catch((error) => {
                if (isAxiosError(error)) {
                    addNotification(
                        "Error",
                        error.response?.data?.error,
                        "danger"
                    );
                } else {
                    addNotification("Error", "Something happened", "danger");
                    console.error(error);
                }
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
