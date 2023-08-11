import { useSelector } from "react-redux";
import { Auction, RootState } from "../types";

const Auctions = () => {
    const auctions = useSelector((state: RootState) => state.auctions);

    return (
        <ul>
            {auctions.map((a) => (
                <li>{a.name}</li>
            ))}
        </ul>
    );
};

export default Auctions;
