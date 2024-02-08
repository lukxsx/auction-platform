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

Cypress.Commands.add("createEndingSoonAuction", () => {
    cy.request(
        "POST",
        `${Cypress.env("backend_url")}/api/testing/createendingsoon`
    );
});

Cypress.Commands.add(
    "createBid",
    ({ user_name, item_model, auction_name, price }) => {
        cy.request({
            url: `${Cypress.env("backend_url")}/api/testing/createbid`,
            method: "POST",
            body: { user_name, item_model, auction_name, price },
        });
    }
);

Cypress.Commands.add(
    "sendBid",
    ({ user_name, item_model, auction_name, price }) => {
        cy.request({
            url: `${Cypress.env("backend_url")}/api/testing/sendbid`,
            method: "POST",
            body: { user_name, item_model, auction_name, price },
        });
    }
);
