import React, { createContext, useContext, useState } from "react";
import { SlideImage } from "yet-another-react-lightbox";

interface LightboxContextType {
    lightboxImage: SlideImage;
    showLightbox: (src: string) => void;
    hideLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(
    undefined
);

export const LightboxProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [lightboxImage, setLightboxImage] = useState({
        src: "",
    } as SlideImage);

    const showLightbox = (src: string) => {
        setLightboxImage({ src });
    };

    const hideLightbox = () => {
        setLightboxImage({ src: "" });
    };

    return (
        <LightboxContext.Provider
            value={{ lightboxImage, showLightbox, hideLightbox }}
        >
            {children}
        </LightboxContext.Provider>
    );
};

export const useLightbox = () => {
    const context = useContext(LightboxContext);
    if (!context) {
        throw new Error("useLightbox must be used within a LightboxProvider");
    }
    return context;
};
