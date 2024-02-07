import { useState } from "react";
import { Form, Button, InputGroup, Table } from "react-bootstrap";
import { InfoValue } from "../../types";

const InfoValues = ({
    infoValues,
    setInfoValues,
}: {
    infoValues: InfoValue[];
    setInfoValues: React.Dispatch<React.SetStateAction<InfoValue[]>>;
}) => {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");

    const addValue = () => {
        setInfoValues(infoValues.concat({ key, value }));
        setKey("");
        setValue("");
    };

    const deleteValue = (key: string) =>
        setInfoValues(infoValues.filter((pair) => pair.key !== key));

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text>Key</InputGroup.Text>
                <Form.Control
                    value={key}
                    id="info-key"
                    minLength={1}
                    onChange={(e) => setKey(e.target.value)}
                />
                <InputGroup.Text>Value</InputGroup.Text>
                <Form.Control
                    value={value}
                    id="info-value"
                    minLength={1}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button
                    onClick={() => addValue()}
                    id="submit-value-button"
                    disabled={key.trim() === "" || value.trim() === ""}
                >
                    Add
                </Button>
            </InputGroup>
            {infoValues.length > 0 && (
                <Table striped>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infoValues.map((pair) => (
                            <tr key={pair.key}>
                                <td>{pair.key}</td>
                                <td>{pair.value}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        onClick={() => deleteValue(pair.key)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default InfoValues;
