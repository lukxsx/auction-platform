// import auctionService from "./services/auctions";
// import { checkDate } from "./utils/helpers";

export const checkAuctions = async () => {
    // try {
    //     const auctions = await auctionService.getAuctions();
    //     auctions.forEach((a) => {
    //         if (checkDate(a.start_date, a.end_date)) {
    //             // Activate inactive auctions
    //             if (!a.active) {
    //                 a.active = true;
    //                 auctionService.updateAuction(a.id, a);
    //                 console.log("Auction", a.id, "(" + a.name + ") activated");
    //             }
    //         } else {
    //             // Deactivate expired auctions
    //             if (a.active) {
    //                 a.active = false;
    //                 auctionService.updateAuction(a.id, a);
    //                 console.log("Auction", a.id, "(" + a.name + ") expired");
    //             }
    //         }
    //     });
    // } catch (error) {
    //     console.error("Error checking auctions");
    //     throw error;
    // }
};
