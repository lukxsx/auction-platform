Cypress.Commands.add("login", ({ username, password }) => {
    cy.request("POST", `${Cypress.env("backend_url")}/api/auth/login`, {
        username,
        password,
    }).then(({ body }) => {
        localStorage.setItem("user", JSON.stringify(body));
        cy.visit(Cypress.env("app_url"));
    });
});

Cypress.Commands.add("resetTestData", () => {
    cy.request(
        "POST",
        `${Cypress.env("backend_url")}/api/testing/resettestdata`
    );
});

Cypress.Commands.add("createTestData", () => {
    cy.request(
        "POST",
        `${Cypress.env("backend_url")}/api/testing/createtestdata`
    );
});
