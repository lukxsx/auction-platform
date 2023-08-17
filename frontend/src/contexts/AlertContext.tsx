import React, { createContext, useContext, useState, useEffect } from "react";
import { AlertContent } from "../types";

interface AlertContextType {
    alert: AlertContent;
    setAlert: (message: string, variant: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlertValues] = useState({ message: "", variant: "" });

    useEffect(() => {
        if (alert.message) {
            const timer = setTimeout(() => {
                setAlertValues({ message: "", variant: "" });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alert]);

    const setAlert = (message: string, variant: string) => {
        setAlertValues({ message, variant });
    };

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider");
    }
    return context;
};
