describe("Map test", () => {
    it("Check zoom in/out buttons", () => {
        cy.visit("http://localhost:5173")
        cy.get(".ol-zoom-in").should("exist")
        cy.get(".ol-zoom-out").should("exist")
    })

    it("Check coordinates", () => {
        cy.visit("http://localhost:5173")
        // viewport should be 1000px by 660px
        cy.get("#map").click(550, 270)
        cy.get('[data-test-id="popup"]').should("exist")

        cy.get('[data-test-id="popup-closer"]').click()
    })

    it("Check coordinate update", () => {
        cy.visit("http://localhost:5173")
        // viewport should be 1000px by 660px
        cy.get("#map").click(550, 270)
        cy.get('[data-test-id="popup-edit"]').click()

        cy.get('[data-test-id="popup-detail"]').clear()
        cy.get('[data-test-id="popup-detail"]').type("Service was below expectations.")
        cy.get('[data-test-id="popup-status"]').uncheck()
        cy.get('[data-test-id="popup-form"]').submit()

        cy.get('[data-test-id="popup-detail"]').should("have.text", "Service was below expectations.")
        cy.get('[data-test-id="popup-closer"]').click()
        cy.get('[data-test-id="popup-form"]').should("not.exist")
    })
})
