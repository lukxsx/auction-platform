import { Toast, ToastContainer } from "react-bootstrap";
import { useNotification } from "../contexts/NotificationContext";

const Notification = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <ToastContainer
            position="top-end"
            className="p-3"
            style={{ zIndex: 10000 }}
        >
            {notifications.map((notification) => (
                <Toast
                    bg={notification.variant}
                    key={notification.id}
                    show={notification.show}
                    onClose={() => {
                        removeNotification(notification.id);
                    }}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {notification.title}
                        </strong>
                    </Toast.Header>
                    <Toast.Body>{notification.message}</Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
};

export default Notification;
