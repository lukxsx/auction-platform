import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAuctionById } from "../reducers/auctions";
import { RootState } from "../types";
import { atoi } from "../utils/helpers";
import ItemList from "./ItemList";

const AuctionPage = () => {
    let { id } = useParams();
    const auctionId = atoi(id as string);
    const auction = useSelector((state: RootState) =>
        selectAuctionById(state, auctionId)
    );
    if (!auction) return <p>Loading...</p>;
    return (
        <div>
            <h1>{auction.name}</h1>
            <ItemList auctionId={auctionId} />
        </div>
    );
};

export default AuctionPage;
