import React, { ReactNode } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
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
