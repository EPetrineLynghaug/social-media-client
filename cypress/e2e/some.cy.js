describe("Auth", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080");
  });

  it("Logging in with valid credentials", () => {
    cy.get("#registerForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get('[data-auth="login"]').click();

    cy.get("#loginForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get("#loginEmail").type("pettatester@stud.noroff.no");
    cy.get("#loginPassword").type("password123");
    cy.get("form#loginForm")
      .find('button[type="submit"]')
      .click({ timeout: 10000 });
    cy.url().should("include", "/?view=profile&name=");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
  });

  it("Logging in with invalid credentials and getting error message", () => {
    cy.get("#registerForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get('[data-auth="login"]').last().click();

    cy.get("#loginForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get("#loginEmail").type("pettatester@stud.noroff.no");
    cy.get("#loginPassword").type("password");
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal(
        "Either your username was not found or your password is incorrect",
      );
    });
    cy.get("form#loginForm").find('button[type="submit"]').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
  });

  it("Loggining in then logging out", () => {
    cy.get("#registerForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get('[data-auth="login"]').last().click();

    cy.get("#loginForm").should("be.visible");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000); // wait for 2 seconds
    cy.get("#loginEmail").type("pettatester@stud.noroff.no");
    cy.get("#loginPassword").type("password123");
    cy.get("form#loginForm")
      .find('button[type="submit"]')
      .click({ timeout: 10000 });
    cy.url().should("include", "/?view=profile&name=");

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
    cy.get('[data-auth="logout"]').click({ timeout: 10000 });
    cy.url().should("eq", "http://127.0.0.1:8080/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000);
  });
});
