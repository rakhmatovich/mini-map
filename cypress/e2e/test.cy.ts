describe("Check  zoom in/out buttons", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173")
        cy.get(".ol-zoom-in").should("exist")
        cy.get(".ol-zoom-out").should("exist")
    })
})

describe("Coordinates", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173")
        // viewport should be 1000px by 660px
        cy.get("#map").click(550, 270)
        cy.get('[data-test-id="popup-closer"]').click()
        // TODO: check the result
    })
})

describe("Coordinate edit", () => {
    it("passes", () => {
        cy.visit("http://localhost:5173")
        // viewport should be 1000px by 660px
        cy.get("#map").click(550, 270)
        cy.get('[data-test-id="popup-edit"]').click()
        cy.get('[data-test-id="popup-detail"]').type("Service was below expectations.")
        cy.get('[data-test-id="popup-status"]').uncheck()
        cy.get('[data-test-id="update-form"]').submit()
        // TODO: check the result
    })
})
