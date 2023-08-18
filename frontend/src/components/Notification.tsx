import { Toast, ToastContainer } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification } from "../reducers/notifications";
import { RootState } from "../types";

const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(
        (state: RootState) => state.notifications
    );

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
                        dispatch(removeNotification(notification.id));
                    }}
                    delay={5000}
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
