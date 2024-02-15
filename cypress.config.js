module.exports = {
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        app_url: "http://localhost:3000",
        backend_url: "http://localhost:3000",
        test_user_name: "test_user",
        test_user_pass: "pass1",
        test_admin_name: "test_admin",
        test_admin_pass: "pass2",
    },
    retries: {
        runMode: 3,
        openMode: 0,
    },
};
