describe('Registration', () => {
    it('Validates user input', () => {
        cy.visit('/register')

        cy.get('[placeholder="email@example.com"]').type('cypress')
        cy.get('[placeholder="Username"]').type('123')
        cy.get('[placeholder="Password"]').type('password')

        cy.get('.has-background-primary-dark').click()

        cy.get('.container > :nth-child(5)').should('have.text', 'Please provide a valid email address')
        cy.get('.container > :nth-child(8)').should('have.text', 'Username must be between 4 and 20 characters')
        cy.get('.container > :nth-child(11)').should('have.text', 'Password must be at least 8 characters and contain uppercase, lowercase and a number')
    })

    it('Signs up a new user account', () => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/users/register`, {
            statusCode: 201,
            fixture: 'user-create-post'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses?limit=4`, {
            statusCode: 200,
            fixture: 'home-businesses'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/promotions?limit=4`, {
            statusCode: 200,
            fixture: 'home-promotions'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/checkins?limit=10`, {
            statusCode: 200,
            fixture: 'home-checkins'
        })

        cy.visit('/register')

        cy.get('[placeholder="email@example.com"]').type('user5@user5.com')
        cy.get('[placeholder="Username"]').type('user5')
        cy.get('[placeholder="Password"]').type('Password1')

        cy.get('.has-background-primary-dark').click()

        cy.get('.message-header').should('have.text', 'Signup successful! You are now logged in as user5')
        cy.get(':nth-child(2) > .navbar-item').should('have.text', 'user5')
    })
})
