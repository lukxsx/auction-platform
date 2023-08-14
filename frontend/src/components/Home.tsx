import { useNotification } from "../contexts/NotificationContext";

const Home = () => {
    const { addNotification } = useNotification();
    const handleClick = () => {
        addNotification("Error", "This is a notification message.", "danger");
    };
    return (
        <div>
            <h2>Welcome to Auctions</h2>
            <button onClick={handleClick}>Show Notification</button>
        </div>
    );
};

export default Home;
