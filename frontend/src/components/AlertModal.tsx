import { Modal, Button } from "react-bootstrap";

const AlertModal = ({
    title,
    message,
    action,
    show,
    close,
}: {
    title: string;
    message: string;
    action: () => void;
    show: boolean;
    close: () => void;
}) => {
    return (
        <Modal show={show} onHide={close} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button
                    id="modal-yes-button"
                    variant="primary"
                    onClick={action}
                >
                    Yes
                </Button>
                <Button
                    id="modal-no-button"
                    variant="secondary"
                    onClick={close}
                >
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlertModal;
