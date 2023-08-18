import { Card } from "react-bootstrap";
import AuctionMenu from "./AuctionMenu";

const Home = () => {
    return (
        <Card>
            <Card.Header>Choose auction</Card.Header>
            <Card.Body>
                <AuctionMenu />
            </Card.Body>
        </Card>
    );
};

export default Home;
