import { Alert as BSAlert } from "react-bootstrap";
import { useAlert } from "../contexts/AlertContext";
import { capitalize } from "../utils/helpers";

const Alert = () => {
    const { alert } = useAlert();
    return (
        <BSAlert variant={alert.variant} show={alert.message.length > 0}>
            {capitalize(alert.message)}
        </BSAlert>
    );
};

export default Alert;
