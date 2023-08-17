import { Alert as BSAlert } from "react-bootstrap";
import { useAlert } from "../contexts/AlertContext";

const Alert = () => {
    const { alert } = useAlert();
    return (
        <BSAlert variant={alert.variant} show={alert.message.length > 0}>
            {alert.message.charAt(0).toUpperCase() + alert.message.slice(1)}
        </BSAlert>
    );
};

export default Alert;
