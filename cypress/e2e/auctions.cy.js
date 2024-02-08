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

    describe("With test data", () => {
        beforeEach(() => {
            cy.resetTestData();
            cy.createTestData();
            cy.visit(Cypress.env("app_url"));
        });

        it("Test data visible", () => {
            cy.contains("test1");
            cy.contains("test2");
            cy.contains("test3");
        });

        describe("Viewing running auction", () => {
            beforeEach(() => {
                cy.get("#auction-list").contains("test1").click();
            });

            it("Auction page visible", () => {
                cy.contains("Card view");
                cy.contains("List view");
            });

            it("Test items visible", () => {
                cy.contains("Product 2");
                cy.contains("Test Company");
            });

            describe("Item page visible", () => {
                beforeEach(() => {
                    cy.wait(5000);
                    cy.contains(".card", "Product 2")
                        .contains("View and bid")
                        .click();
                });

                it("Item page contains required info", () => {
                    cy.contains("Product 2");
                    cy.contains("Manufacturer");
                    cy.contains("Model");
                    cy.contains("Starting price");
                    cy.contains("Current price");
                    cy.contains("Status");
                });

                it("Adding a bid", () => {
                    cy.wait(500);
                    cy.get("#submit-bid-button").click();
                    cy.contains("Bid added");
                    cy.contains("You are about to win this item");
                });
            });
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
            cy.resetTestData();
            cy.visit(Cypress.env("app_url"));
            cy.get("#new-auction-button").click();
        });

        it("Add a new auction", () => {
            cy.get("#auction-name").type("test auction");
            cy.get("#start-time").type(getTime());
            cy.get("#end-time").type(getTime(1));
            cy.get("#submit-auction-button").click();
            cy.contains("Successfully added new auction");
            cy.contains("test auction");
        });
    });

    describe("With test data", () => {
        beforeEach(() => {
            cy.resetTestData();
            cy.createTestData();
            cy.visit(Cypress.env("app_url"));
        });

        it("Test data visible", () => {
            cy.contains("test1");
            cy.contains("test2");
            cy.contains("test3");
        });

        describe("Viewing running auction", () => {
            beforeEach(() => {
                cy.get("#auction-list").contains("test1").click();
            });

            it("Auction page visible", () => {
                cy.contains("Edit auction");
                cy.contains("Add a new item");
                cy.contains("Download report");
                cy.contains("Delete auction");
                cy.contains("Card view");
                cy.contains("List view");
            });

            it("Test items visible", () => {
                cy.contains("Product 2");
                cy.contains("Test Company");
            });

            describe("Item page visible", () => {
                beforeEach(() => {
                    cy.wait(5000);
                    cy.contains(".card", "Product 2")
                        .contains("View and bid")
                        .click();
                });

                it("Item page contains required fields", () => {
                    cy.contains("Manufacturer");
                    cy.contains("Model");
                    cy.contains("Starting price");
                    cy.contains("Current price");
                    cy.contains("Status");
                });

                it("Edit item", () => {
                    cy.get("#edit-item-button").click();
                    cy.get("#item-code").type("a1");
                    cy.get("#item-make").clear().type("Something");
                    cy.get("#item-startingprice").clear().type("5");
                    cy.get("#info-key").type("asd");
                    cy.get("#info-value").type("dsa");
                    cy.get("#submit-value-button").click();
                    cy.get("#submit-item-edit").click();
                    cy.contains("Successfully updated item");
                    cy.contains("Something");
                    cy.contains("asd");
                    cy.contains("dsa");
                });

                it("Delete item", () => {
                    cy.get("#delete-item-button").click();
                    cy.get("#modal-yes-button").click();
                    cy.get("body").should("not.contain.text", "Product 2");
                });
            });
        });
    });
});
