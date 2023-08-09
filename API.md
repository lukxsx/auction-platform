IDEA 1
# GET     /api/auctions
Show list of auctions

# GET     /api/auctions/<id>
Show auction details
* start time
* end time

# GET     /api/auctions/<id>/items
Show items in auction

# POST    /api/auctions/<id>/items
Add item to auction

# GET     /api/auctions/<id>/items/<id>
Get item details and bid history

# POST    /api/auctions/<id>/items/<id>
Bid

IDEA 2
# GET     /api/auctions

# GET     /api/items
List items

# GET     /api/items/<id>
Item details and bids

# POST    /api/items
Add new item

# POST    /api/items/<id>
Add bid