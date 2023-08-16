import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notification {
    id: number;
    title: string;
    message: string;
    variant: string;
    show: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (title: string, message: string, variant: string) => void;
    removeNotification: (id: number) => void;
}

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (
        title: string,
        message: string,
        variant: string
    ) => {
        const newNotification: Notification = {
            id: Date.now(),
            title,
            message,
            variant,
            show: true,
        };
        setNotifications([...notifications, newNotification]);
    };

    const removeNotification = (id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id
                    ? { ...notification, show: false }
                    : notification
            )
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (notifications.length > 0 && !notifications[0].show) {
                setNotifications((prevNotifications) =>
                    prevNotifications.slice(1)
                );
            }
        }, 100);
        return () => clearInterval(timer);
    }, [notifications]);

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};
