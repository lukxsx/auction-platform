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
