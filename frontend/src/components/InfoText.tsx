import { ListGroup } from "react-bootstrap";

const InfoText = ({
    info,
    addPrefix,
}: {
    info: string;
    addPrefix: boolean;
}) => {
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
            <>
                {jsonList.map(([key, value]) => (
                    <ListGroup.Item key={key}>
                        <strong>{key}:</strong> {value}
                    </ListGroup.Item>
                ))}
            </>
        );
    } else {
        // Render as text
        return (
            <ListGroup.Item>
                {(addPrefix && (
                    <>
                        <strong>Info:</strong> {infoData}
                    </>
                )) || <>{infoData}</>}
            </ListGroup.Item>
        );
    }
};

export default InfoText;
