import { isAxiosError } from "axios";
import { store } from "../store";
import { clearUser } from "../reducers/user";
import { addNotification } from "../reducers/notifications";

class ErrorHandlingService {
    static addErrorNotification(
        title: string,
        message: string,
        variant: string
    ) {
        store.dispatch(addNotification({ title, message, variant }));
    }

    // Check the error and determine if it's from Axios
    // Add correct error notification to queue
    static handleError(error: unknown) {
        if (isAxiosError(error)) {
            // Does it contain the custom error message?
            if (error.response?.data) {
                // Session expired
                if (error.response.data.error === "jwt expired") {
                    store.dispatch(clearUser());
                    error.response.data.error = "Session expired";
                }
                this.addErrorNotification(
                    "Error",
                    error.response.data.error,
                    "danger"
                );
            } else {
                // Print default message
                this.addErrorNotification("Error", error.message, "danger");
            }
        } else {
            this.addErrorNotification(
                "Error",
                error instanceof Error
                    ? error.message
                    : "Something bad happened",
                "danger"
            );

            console.error(error);
        }
    }
}

export default ErrorHandlingService;
