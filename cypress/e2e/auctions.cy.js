const getTime = (offset) => {
    const addition = offset ? offset : 0;
    const now = new Date();
    const currentMinutes = now.getMinutes() + addition;
    const currentTime = `${now.getHours()}:${
        currentMinutes < 10 ? "0" : ""
    }${currentMinutes}`;
    return currentTime;
};

describe("Login", () => {
    beforeEach(function () {
        cy.visit(Cypress.env("app_url"));
    });

    it("Login page opens", () => {
        cy.contains("Login");
        cy.contains("Username");
        cy.contains("Password");
    });

    it("Login fails with incorrect credentials", () => {
        cy.get("#username").type("asdasd");
        cy.get("#password").type("fdsfsd");
        cy.get("#login-button").click();
        cy.contains("Incorrect username or password");
    });

    it("Login in with valid credentials", () => {
        cy.get("#username").type(Cypress.env("test_user_name"));
        cy.get("#password").type(Cypress.env("test_user_pass"));
        cy.get("#login-button").click();
        cy.contains(`Logged in as ${Cypress.env("test_user_name")}`);
    });
});

describe("Logged in as a regular user", () => {
    beforeEach(() => {
        cy.login({
            username: Cypress.env("test_user_name"),
            password: Cypress.env("test_user_pass"),
        });
    });
});

describe("Logged in as an admin user", () => {
    beforeEach(() => {
        cy.login({
            username: Cypress.env("test_admin_name"),
            password: Cypress.env("test_admin_pass"),
        });
    });

    it("Admin can see new auction button", () => {
        cy.contains("Add a new auction");
    });

    describe("Adding a new auction", () => {
        beforeEach(() => {
            cy.get("#new-auction-button").click();
        });
        it("Add a new auction", () => {
            cy.get("#auction-name").type("test auction");
            cy.get("#start-time").type(getTime());
            cy.get("#end-time").type(getTime(1));
            cy.get("#submit-auction-button").click();
            cy.contains("test auction");
        });
    });
});
