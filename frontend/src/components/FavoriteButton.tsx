import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { BsStar, BsStarFill } from "react-icons/bs";

const FavoriteButton = ({
    favorite,
    changeFavorite,
}: {
    favorite: boolean;
    changeFavorite: () => void;
}) => {
    return (
        <OverlayTrigger
            key="top"
            placement="top"
            overlay={
                <Tooltip id="tooltip-top">
                    {favorite ? "Remove from favorites" : "Add to favorites"}
                </Tooltip>
            }
        >
            <Button variant="link" onClick={() => changeFavorite()}>
                {favorite ? (
                    <BsStarFill size="1.5em" />
                ) : (
                    <BsStar size="1.5em" />
                )}
            </Button>
        </OverlayTrigger>
    );
};

export default FavoriteButton;
