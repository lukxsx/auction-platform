import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../types";

const Layout = ({ children }: { children: ReactNode }) => {
    const user = useSelector((state: RootState) => state.user.user);
    console.log("user:", user);
    return (
        <Container fluid>
            <Row>
                <Sidebar />
                <Col sm={8} md={9} className="content">
                    {children}
                </Col>
            </Row>
        </Container>
    );
};

export default Layout;
