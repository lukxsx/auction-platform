import { isAxiosError } from "axios";
import { store } from "../store";
import { clearUser } from "../reducers/user";

class ErrorHandlingService {
    static addErrorNotification(
        addNotification: (
            title: string,
            message: string,
            variant: string
        ) => void,
        title: string,
        message: string,
        variant: string
    ) {
        addNotification(title, message, variant);
    }

    // Check the error and determine if it's from Axios
    // Add correct error notification to queue
    static handleError(
        error: unknown,
        addNotification: (
            title: string,
            message: string,
            variant: string
        ) => void
    ) {
        if (isAxiosError(error)) {
            // Does it contain the custom error message?
            if (error.response?.data) {
                // Session expired
                if (error.response.data.error === "jwt expired") {
                    store.dispatch(clearUser());
                    error.response.data.error = "Session expired";
                }
                this.addErrorNotification(
                    addNotification,
                    "Error",
                    error.response.data.error,
                    "danger"
                );
            } else {
                // Print default message
                this.addErrorNotification(
                    addNotification,
                    "Error",
                    error.message,
                    "danger"
                );
            }
        } else {
            this.addErrorNotification(
                addNotification,
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
