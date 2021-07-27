describe('User logged out', () => {
    it('Can view profile', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/users/4`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/users/4/public`, {
            statusCode: 200,
            fixture: 'user-show'
        })

        cy.visit('/users/4')

        cy.get('.mt-5').should('have.text', 'user4')
        cy.get('.message-header').should('not.exist')
    })
})

describe('User logged in', () => {
    beforeEach(() => {
        cy.fixture('user-login').then((user) => {
            cy.window().then((window) => {
                window.localStorage.setItem('session', JSON.stringify(user))
            })
        })
    })

    it('Can view profile', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/users/4`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/users/4/public`, {
            statusCode: 200,
            fixture: 'user-show'
        })

        cy.visit('/users/4')

        cy.get('.message-header').should('not.exist')
        cy.get('.mt-5').should('have.text', 'user4')
    })

    it('Can edit profile', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/users/4`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/users/4/public`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept('patch', `${Cypress.env('apiUrl')}/users/4`, {
            statusCode: 200,
            fixture: 'user-bio-edit'
        })

        cy.visit('/users/4')

        cy.get('.message-header').should('not.exist')
        cy.get('.mt-5').should('have.text', 'user4')

        cy.get('.is-flex-mobile > .button').click()
        cy.get('.textarea').type('. I have been edited!')
        cy.get('.mt-5 > .has-background-primary-dark').click()
    })
})
