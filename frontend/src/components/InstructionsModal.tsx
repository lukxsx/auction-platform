import { Modal, ListGroup } from "react-bootstrap";

const InstructionsModal = ({
    show,
    close,
}: {
    show: boolean;
    close: () => void;
}) => {
    return (
        <Modal
            size="lg"
            show={show}
            onHide={() => {
                close();
            }}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>Instructions</Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item>Instructions here...</ListGroup.Item>
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default InstructionsModal;
