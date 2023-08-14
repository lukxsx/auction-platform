import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { atoi } from "../utils/helpers";
import ItemList from "./ItemList";
import { Container } from "react-bootstrap";

const formatDate = (date: Date): string => {
    const day: string = String(date.getDate()).padStart(2, "0");
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const year: number = date.getFullYear();
    const hours: string = String(date.getHours()).padStart(2, "0");
    const minutes: string = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const AuctionPage = () => {
    let { id } = useParams();
    const auctionId = atoi(id as string);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );
    if (!auction) return <p>Loading...</p>;

    const startDate = new Date(auction.start_date);
    const endDate = new Date(auction.end_date);
    return (
        <Container>
            <h1>{auction.name}</h1>
            <h4>
                {formatDate(startDate)} — {formatDate(endDate)}
            </h4>
            <ItemList auctionId={auctionId} />
        </Container>
    );
};

export default AuctionPage;
