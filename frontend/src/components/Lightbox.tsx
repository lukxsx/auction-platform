import { Lightbox as LB } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useLightbox } from "../contexts/LightboxContext";
import "yet-another-react-lightbox/styles.css";

const Lightbox = () => {
    const { lightboxImage, hideLightbox } = useLightbox();

    return (
        <LB
            plugins={[Zoom]}
            open={lightboxImage.src !== ""}
            close={() => hideLightbox()}
            slides={[lightboxImage]}
        />
    );
};

export default Lightbox;
