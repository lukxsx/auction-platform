import { useSelector } from "react-redux";
import { RootState, AuctionState } from "../../types";
import AuctionList from "./AuctionList";

const AuctionMenu = () => {
    const auctions = useSelector((state: RootState) => state.auctions);
    const currentAuctions = auctions.filter(
        (a) => a.state === AuctionState.Running
    );
    const upcomingAuctions = auctions.filter(
        (a) => a.state === AuctionState.Pending
    );
    const pastAuctions = auctions.filter(
        (a) => a.state === AuctionState.Finished
    );

    return (
        <div id="auction-list">
            <AuctionList
                auctions={currentAuctions}
                title="Running auctions"
                variant="success"
            />
            <AuctionList
                auctions={upcomingAuctions}
                title="Upcoming auctions"
                variant="secondary"
            />
            <AuctionList
                auctions={pastAuctions}
                title="Past auctions"
                variant="dark"
            />
        </div>
    );
};

export default AuctionMenu;
