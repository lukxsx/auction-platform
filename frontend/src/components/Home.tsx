import { Container } from "react-bootstrap";
import AuctionMenu from "./AuctionMenu";

const Home = () => {
    return (
        <Container>
            <h2>Welcome to Auctions</h2>
            <AuctionMenu />
        </Container>
    );
};

export default Home;
