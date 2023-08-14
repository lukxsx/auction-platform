import { ListGroup } from "react-bootstrap";

const InfoText = ({ info }: { info: string }) => {
    let infoData: string | object = "";
    try {
        // Check if info field is in JSON format
        const parsedData = JSON.parse(info);
        infoData = parsedData;
    } catch (error) {
        // Not JSON, treat it as plain text
        infoData = info;
    }

    if (infoData === null) {
        return <div>Loading...</div>;
    } else if (typeof infoData === "object") {
        // Render as ul
        const jsonList = Object.entries(infoData);
        return (
            <ListGroup.Item>
                <strong>Info:</strong>
                <ul>
                    {jsonList.map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            </ListGroup.Item>
        );
    } else {
        // Render as text
        return (
            <ListGroup.Item>
                <strong>Info:</strong> {infoData}
            </ListGroup.Item>
        );
    }
};

export default InfoText;
