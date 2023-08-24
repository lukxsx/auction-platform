import { Lightbox as LB } from "yet-another-react-lightbox";
import { useLightbox } from "../contexts/LightboxContext";
import "yet-another-react-lightbox/styles.css";

const Lightbox = () => {
    const { lightboxImage, hideLightbox } = useLightbox();

    return (
        <LB
            open={lightboxImage.src !== ""}
            close={() => hideLightbox()}
            slides={[lightboxImage]}
        />
    );
};

export default Lightbox;
