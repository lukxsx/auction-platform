import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { Item } from "../types";

const ItemCard = ({ item }: { item: Item }) => {
    return (
        <Card>
            <Card.Body>
                <Card.Title>{item.model}</Card.Title>
                <Card.Subtitle>{item.make}</Card.Subtitle>
                {item.info && <Card.Text>{item.info}</Card.Text>}
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        Current price: {item.current_price}
                    </ListGroup.Item>
                    {item.winner_name && (
                        <ListGroup.Item>
                            Highest bidder: {item.winner_name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
                <Button variant="primary">View and bid</Button>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
