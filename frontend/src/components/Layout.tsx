import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import AuctionPage from "./AuctionPage";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <Container fluid>
            <Row>
                <Sidebar />
                <Col sm={8} md={9} className="content">
                    <Routes>
                        <Route path="auction/:id" element={<AuctionPage />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
