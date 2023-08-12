import { useSelector } from "react-redux";
import { RootState } from "../types";

const AuctionList = () => {
    const auctions = useSelector((state: RootState) => state.auctions);

    return (
        <div>
            <ul>
                {auctions.map((a) => (
                    <li>{a.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default AuctionList;
