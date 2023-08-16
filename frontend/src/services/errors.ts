import { isAxiosError } from "axios";

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
                "Something bad happened",
                "danger"
            );
            console.error(error);
        }
    }
}

export default ErrorHandlingService;
